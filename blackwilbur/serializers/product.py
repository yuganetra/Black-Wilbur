from rest_framework import serializers

from blackwilbur import models
from blackwilbur.serializers import ProductVariationSerializer

class ProductSerializer(serializers.ModelSerializer):
    product_images = serializers.SerializerMethodField()

    class Meta:
        model = models.Product
        fields = ['id', 'name', 'price', 'product_images']
        read_only_fields = ['id', 'name', 'price', 'product_images']

    def get_product_images(self, instance):
        return instance.images.all()


class ProductDetailSerializer(serializers.ModelSerializer):
    sizes = ProductVariationSerializer(many=True)
    rating = serializers.SerializerMethodField()

    class Meta:
        model = models.Product
        fields = ProductSerializer.Meta.fields + [
            "description",
            "sizes",
            "rating",
        ]
        read_only_fields = ProductSerializer.Meta.fields + [
            "description",
            "sizes",
            "rating",
        ]

    def get_rating(self, instance):
        ratings = instance.reviews.all()
        if ratings.exists():
            average_rating = ratings.aggregate(models.Avg('rating'))['rating__avg']
        else:
            return 0
        return round(min(max(average_rating, 0), 5), 1)
