from rest_framework import serializers

from blackwilbur import models


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = [
            'id',
            'created_at',
            'status',
            'phone_number',
            'address_line_1',
            'address_line_2',
            'city',
            'state',
            'zip_code',
            'country',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'status',
            'phone_number',
            'address_line_1',
            'address_line_2',
            'city',
            'state',
            'zip_code',
            'country',
        ]