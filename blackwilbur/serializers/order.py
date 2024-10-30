from rest_framework import serializers
from blackwilbur import models
from blackwilbur.serializers.product import ProductSerializer

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = [
            'order_id', 'status', 'phone_number', 'address_line_1', 
            'address_line_2', 'city', 'state', 'zip_code', 'country', 
            'email', 'payment_method'
        ]
        read_only_fields = ['order_id']  # Make order_id read-only if it's auto-generated

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_variation = serializers.SerializerMethodField()

    class Meta:
        model = models.OrderItem
        fields = ['product', 'quantity', 'product_variation']  # Ensure this field is included

    def validate_product_variation(self, value):
        if value is None:
            raise serializers.ValidationError("Product variation is required.")
        return value

    def get_product_variation(self, instance):
        # Assuming `product_variation` is related to the `OrderItem` model
        if instance.product_variation:
            return {
                'id': instance.product_variation.id,  # Get the UUID of the product variation
                'size': instance.product_variation.size  # Get the size of the product variation
            }
        return None  # Return None or an empty dict if there is no product variation
