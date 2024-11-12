from rest_framework import serializers
from blackwilbur.models import Discount

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['id', 'coupon', 'percent_discount', 'min_order_price', 'quantity_threshold', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    # Custom validation for fields based on the new model
    def validate(self, data):
        # Ensure that either 'coupon' or 'quantity_threshold' is provided, but not both.
        if not data.get('coupon') and not data.get('quantity_threshold'):
            raise serializers.ValidationError({'non_field_errors': 'Either a coupon code or a quantity threshold must be provided.'})

        # Optional: Ensure that 'coupon' is only provided if 'quantity_threshold' is not present
        if data.get('coupon') and data.get('quantity_threshold'):
            raise serializers.ValidationError({'non_field_errors': 'Coupon code and quantity threshold should not be provided together.'})

        return data
