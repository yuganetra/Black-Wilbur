from rest_framework import serializers
from blackwilbur.models import ShippingAddress

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = [
            'user', 
            'address_line1', 
            'address_line2', 
            'city', 
            'state', 
            'zipcode', 
            'country', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']  # Make fields like `id`, `created_at`, and `updated_at` read-only
