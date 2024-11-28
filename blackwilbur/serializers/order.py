from rest_framework import serializers
from blackwilbur import models
from blackwilbur.serializers.product import ProductSerializer
from blackwilbur.serializers.shippingaddress import ShippingAddressSerializer

class OrderSerializer(serializers.ModelSerializer):
    shipping_address = ShippingAddressSerializer()  # Nest the ShippingAddressSerializer

    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = models.Order
        fields = ['subtotal', 'discount_amount', 'tax_amount', 'shipping_cost', 'total_amount', 'payment_method', 'phone_number', 'shipping_address','discount_coupon_applied']
        read_only_fields = ['order_id', 'created_at', 'updated_at', 'subtotal', 'discount_amount', 'tax_amount', 'total_amount']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_variation = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = models.OrderItem
        fields = [
            'product', 'quantity', 'product_variation', 'price',
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
