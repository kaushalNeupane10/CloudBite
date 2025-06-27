import os
import json
import logging
import stripe

from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.contrib.auth.models import User

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import MenuItem, CartItem, Order, Review, OrderItem
from .serializers import (
    MenuItemSerializer,
    CartItemSerializer,
    OrderSerializer,
    ReviewSerializer,
    RegisterSerializer
)

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

#  Menu Item ViewSet
class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all().order_by('-created_at')
    serializer_class = MenuItemSerializer

#  Cart Item ViewSet
class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ✅ Order ViewSet
class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

# ✅ Review ViewSet
class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ✅ Register View
@api_view(['POST'])
@permission_classes([AllowAny])
def RegisterView(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Stripe Checkout for Single Item
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
            success_url=f"{FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/cancel",
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

# ✅ Stripe Checkout for Multiple Cart Items
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
        success_url=f"{FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{FRONTEND_URL}/cancel",
        metadata={
            'user_id': str(user.id),
            'cart': json.dumps(cart_metadata)
        }
    )
    return Response({"sessionId": session.id})

# ✅ Stripe Webhook to Create Order
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

        try:
            user = User.objects.get(id=metadata.get('user_id'))
            cart_items = json.loads(metadata.get('cart'))

            CartItem.objects.filter(user=user).delete()

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
