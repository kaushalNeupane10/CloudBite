import logging
logger = logging.getLogger(__name__)
import stripe
from django.utils import timezone
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.contrib.auth.models import User
from django.conf import settings
from .models import MenuItem, CartItem, Order, Review, OrderItem
from .serializers import (
    MenuItemSerializer,
    CartItemSerializer,
    OrderSerializer,
    ReviewSerializer,
    RegisterSerializer,
)
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from rest_framework.filters import SearchFilter

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter]
    search_fields = ['title', 'description']  

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by('-ordered_at')
        return Order.objects.filter(user=user).order_by('-ordered_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Review.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# Stripe setup
stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    try:
        item_id = request.data.get("menu_item_id")
        quantity = request.data.get("quantity", 1)

        item = MenuItem.objects.get(id=item_id)

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": item.title,
                        "description": item.description,
                    },
                    "unit_amount": int(item.price * 100),
                },
                "quantity": quantity,
            }],
            mode="payment",
            success_url="http://localhost:3000/success",
            cancel_url="http://localhost:3000/cancel",
            metadata={
                "user_id": str(request.user.id),
                "cart": json.dumps([{
                    "menu_item_id": item.id,
                    "quantity": quantity,
                    "price": float(item.price)
                }])
            }
        )

        return Response({"sessionId": session.id})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_multi_checkout_session(request):
    user = request.user
    cart_items = CartItem.objects.filter(user=user)

    if not cart_items.exists():
        return Response({"error": "Your cart is empty"}, status=400)

    line_items = []
    cart_metadata = []

    for item in cart_items:
        menu_item = item.menu_item
        line_items.append({
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': menu_item.title,
                },
                'unit_amount': int(menu_item.price * 100),
            },
            'quantity': item.quantity,
        })
        cart_metadata.append({
            "menu_item_id": menu_item.id,
            "quantity": item.quantity,
            "price": float(menu_item.price)
        })

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=line_items,
        mode='payment',
        success_url='http://localhost:3000/success',
        cancel_url='http://localhost:3000/cancel',
        metadata={
            'user_id': str(user.id),
            'cart': json.dumps(cart_metadata)
        }
    )
    return Response({"sessionId": session.id})


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        logger.error(f"Invalid payload: {e}")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {e}")
        return HttpResponse(status=400)

    logger.info(f"Received event: {event['type']}")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        metadata = session.get('metadata', {})
        logger.info(f"Session metadata: {metadata}")

        user_id = metadata.get('user_id')
        cart_items_json = metadata.get('cart')

        try:
            user = User.objects.get(id=user_id)
            cart_items = json.loads(cart_items_json)
        except Exception as e:
            logger.error(f"Error parsing metadata or user: {e}")
            return HttpResponse(status=400)

        try:
            # Clear old cart
            CartItem.objects.filter(user=user).delete()

            # Create new order
            order = Order.objects.create(
                user=user,
                total_price=sum(item['price'] * item['quantity'] for item in cart_items),
                is_paid=True,
                status='success',
                ordered_at=timezone.now()
            )

            for item in cart_items:
                menu_item = MenuItem.objects.get(id=item['menu_item_id'])
                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    quantity=item['quantity'],
                    price_at_order=item['price']
                )

            logger.info(f"Order #{order.id} created for user {user.username}")

        except Exception as e:
            logger.error(f"Error creating order: {e}")
            return HttpResponse(status=500)

    return HttpResponse(status=200)
