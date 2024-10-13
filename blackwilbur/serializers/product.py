from rest_framework.serializers import ModelSerializer, SerializerMethodField

from blackwilbur import models, serializers


class ProductSerializer(ModelSerializer):
    product_images = SerializerMethodField()

    class Meta:
        model = models.Product
        fields = ['id', 'name', 'price', 'product_images']
        read_only_fields = ['id', 'name', 'price', 'product_images']

    def get_product_images(self, instance):
        images = instance.images.all()
        return serializers.ProductImageSerializer(images, many=True).data


class ProductDetailSerializer(ModelSerializer):
    sizes = serializers.ProductVariationSerializer(many=True)
    rating = SerializerMethodField()

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
