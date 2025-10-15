from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    MenuItemViewSet, CartItemViewSet, OrderViewSet, ReviewViewSet,
    RegisterView, login_view, logout_view, me_view, merge_cart_view,
    create_checkout_session, create_multi_checkout_session, stripe_webhook
)

router = DefaultRouter()
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')
router.register(r'cart-items', CartItemViewSet, basename='cartitem')
router.register(r'orders', OrderViewSet, basename='orderitem')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('api/', include(router.urls)),

    # Auth
    path('api/register/', RegisterView, name='register'),
    path('api/login/', login_view, name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/me/', me_view, name='current_user'),

    # Guest cart merge
    path('api/merge-cart/', merge_cart_view, name='merge_cart'),

    # JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Stripe
    path("api/create-checkout-session/", create_checkout_session, name="create-checkout-session"),
    path("api/create-multi-checkout-session/", create_multi_checkout_session, name="create-multi-checkout-session"),
    path('api/stripe-webhook/', stripe_webhook, name='stripe-webhook'),
]
