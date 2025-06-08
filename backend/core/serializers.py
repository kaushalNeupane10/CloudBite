from rest_framework import serializers
from .models import MenuItem, CartItem, Order, Review, OrderItem 
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class MenuItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'description', 'price', 'image']

    def get_image(self, obj):
        if obj.image:
            return obj.image.url  

class CartItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)
    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(), write_only=True, source='menu_item'
    )

    class Meta:
        model = CartItem
        fields = ['id', 'menu_item', 'menu_item_id', 'quantity']


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [ 'id','menu_item', 'quantity', 'price_at_order']


class OrderSerializer(serializers.ModelSerializer):
     user = UserSerializer(read_only=True)
     items = OrderItemSerializer(source='order_items', many=True, read_only=True)

     class Meta:
        model = Order
        fields = ['id', 'user', 'items', 'total_price', 'is_paid', 'status', 'ordered_at']
        read_only_fields = fields # readonly for safety
     def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        # Create the order instance first (without total_price, you can update it later)
        order = Order.objects.create(user=user, total_price=0)

        total_price = 0
        for item_data in items_data:
            menu_item = item_data['menu_item']
            quantity = item_data.get('quantity', 1)

            # Create CartItem for this user
            cart_item = CartItem.objects.create(user=user, menu_item=menu_item, quantity=quantity)
            order.items.add(cart_item)

            # Calculate total price
            total_price += menu_item.price * quantity

        # Update order total price
        order.total_price = total_price
        order.save()

        return order


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
