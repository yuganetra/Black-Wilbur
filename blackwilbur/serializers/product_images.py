from rest_framework import serializers

from blackwilbur import models

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImage
        fields = [
            'id',
            'image',
        ]
        read_only_fields = [
            'id',
            'image',
        ]

