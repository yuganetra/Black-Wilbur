from rest_framework import serializers
from blackwilbur import models

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImage
        fields = ['id', 'image']  # Include the fields you want to serialize
