from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import MenuItemViewSet, CartItemViewSet, OrderViewSet, ReviewViewSet, RegisterView, create_checkout_session, create_multi_checkout_session
from .views import stripe_webhook


router = DefaultRouter()
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')
router.register(r'cart-items', CartItemViewSet, basename='cartitem')
router.register(r'orders', OrderViewSet, basename='orderitem')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/register/', RegisterView, name='register'),

    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #payment
    path("api/create-checkout-session/", create_checkout_session, name="create-checkout-session"),

    #multiple payment
    path("api/create-multi-checkout-session/", create_multi_checkout_session, name="create-multi-checkout-session"),

    #webhook
    path('api/stripe-webhook/', stripe_webhook, name='stripe-webhook'),
]
