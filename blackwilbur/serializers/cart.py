from rest_framework import serializers
from blackwilbur import models
from blackwilbur.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    size = serializers.SerializerMethodField()

    class Meta:
        model = models.CartItem
        fields = [
            'id',
            'quantity',
            'product',
            'size',
        ]
        read_only_fields = [
            'id',
            'quantity',
            'product',
            'size',
        ]

    def get_size(self, instance):
        # Assuming `product_variation` is related to the `CartItem` model
        return {
            'id': instance.product_variation.id,  # Get the ID of the product variation
            'size': instance.product_variation.size  # Get the size of the product variation
        }
