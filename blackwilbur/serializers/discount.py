from rest_framework import serializers
from blackwilbur.models import Discount

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['id', 'coupon', 'percent_discount', 'min_order_price', 'quantity_threshold', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    # Custom validation for fields
    def validate(self, data):
        # Ensure that both 'coupon' and 'quantity_threshold' are provided together
        coupon = data.get('coupon')
        quantity_threshold = data.get('quantity_threshold')

        if not coupon or not quantity_threshold:
            raise serializers.ValidationError(
                {'non_field_errors': 'Both coupon code and quantity threshold are required.'}
            )

        return data
