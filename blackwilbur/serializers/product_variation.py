from rest_framework import serializers

from blackwilbur import models


class ProductVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductVariation
        fields = [
            'id',
            'size',
            'quantity',
        ]
        read_only_fields = [
            'id',
            'size',
            'quantity',
        ]