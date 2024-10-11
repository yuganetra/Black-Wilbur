from rest_framework import serializers
from blackwilbur.models import CartItem

class CartItemSerializer(serializers.Serializer):
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity', 'product_variation']
