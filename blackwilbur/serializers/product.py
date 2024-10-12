from rest_framework import serializers

from blackwilbur import models

class ProductSerializer(serializers.ModelSerializer):
    product_images = serializers.SerializerMethodField()
    
    class Meta:
        model = models.Product
        fields = ['id', 'name', 'price', 'product_images']
        read_only_fields = ['id', 'name', 'price', 'product_images']

    def get_product_images(self, instance):
        return instance.images.all()