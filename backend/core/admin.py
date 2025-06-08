from django.contrib import admin
from .models import MenuItem, CartItem, Order, Review

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'created_at']
    search_fields = ['title']


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'menu_item', 'quantity']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_price', 'is_paid', 'ordered_at']
    list_filter = ['is_paid', 'ordered_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'menu_item', 'rating', 'created_at']
    search_fields = ['comment']
