from rest_framework import serializers
from blackwilbur import models
from blackwilbur.serializers.product import ProductSerializer

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = ['order_id', 'status', 'phone_number', 'address_line_1', 
                  'address_line_2', 'city', 'state', 'zip_code', 'country', 
                  'email', 'payment_method']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_variation_id = serializers.SerializerMethodField()
    class Meta:
        model = models.OrderItem
        fields = ['product', 'quantity', 'product_variation_id']  # Ensure this field is included
    
    def validate_product_variation_id(self, value):
        if value is None:
            raise serializers.ValidationError("Product variation is required.")
        return value
    def get_product_variation_id(self, instance):
        # Assuming `product_variation` is related to the `CartItem` model
        return {
            'id': instance.product_variation.id,  # Get the ID of the product variation
            'size': instance.product_variation.size  # Get the size of the product variation
        }
