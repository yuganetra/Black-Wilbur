# serializers/discount_serializer.py

from rest_framework import serializers
from blackwilbur.models import Discount

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['id', 'coupon', 'percent_discount', 'min_order_price', 'quantity_threshold', 'discount_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    # Custom validation for discount_type and related fields
    def validate(self, data):
        # If the discount type is 'COUPON', ensure 'coupon' is present and 'quantity_threshold' is not provided
        if data['discount_type'] == 'COUPON':
            if not data.get('coupon'):
                raise serializers.ValidationError({'coupon': 'Coupon code is required for COUPON type discount.'})
            if data.get('quantity_threshold'):
                raise serializers.ValidationError({'quantity_threshold': 'Quantity threshold should not be provided for COUPON type discount.'})
        
        # If the discount type is 'QUANTITY', ensure 'quantity_threshold' is present and 'coupon' is not provided
        elif data['discount_type'] == 'QUANTITY':
            if data.get('coupon'):
                raise serializers.ValidationError({'coupon': 'Coupon code should not be provided for QUANTITY type discount.'})
            if not data.get('quantity_threshold'):
                raise serializers.ValidationError({'quantity_threshold': 'Quantity threshold is required for QUANTITY type discount.'})

        # If both conditions are not met, validation will pass.
        return data
