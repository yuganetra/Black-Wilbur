from rest_framework import serializers
from blackwilbur import models
from blackwilbur.serializers.product import ProductSerializer

class OrderSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = models.Order
        fields = [
            'order_id', 'status', 'phone_number', 'address_line_1', 'address_line_2',
            'city', 'state', 'zip_code', 'country', 'email', 'payment_method', 
            'payment_status', 'subtotal', 'discount_amount', 'tax_amount', 'total_amount',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['order_id', 'created_at', 'updated_at', 'subtotal', 'discount_amount', 'tax_amount', 'total_amount']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_variation = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = models.OrderItem
        fields = [
            'product', 'quantity', 'product_variation', 'price', 'discount_amount',
            'tax_amount', 'total_price'
        ]

    def validate_product_variation(self, value):
        if value is None:
            raise serializers.ValidationError("Product variation is required.")
        return value

    def get_product_variation(self, instance):
        if instance.product_variation:
            return {
                'id': instance.product_variation.id,  # Get the UUID of the product variation
                'size': instance.product_variation.size  # Get the size of the product variation
            }
        return None
