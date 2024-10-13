from rest_framework import serializers

from blackwilbur import models, serializers


class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.ProductSerializer(read_only=True)
    product_variation = serializers.ProductVariationSerializer(read_only=True)

    class Meta:
        model = models.CartItem
        fields = [
            'id',
            'quantity',
            'product',
            'product_variation',
        ]
        read_only_fields = [
            'id',
            'quantity',
            'product',
            'product_variation',
        ]