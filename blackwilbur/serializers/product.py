from rest_framework.serializers import ModelSerializer, SerializerMethodField

from blackwilbur import models, serializers


class ProductSerializer(ModelSerializer):
    product_images = SerializerMethodField()

    class Meta:
        model = models.Product
        fields = [
            'id', 'name', 'description', 'price', 'availability',
            'discount', 'product_images'
        ]
        read_only_fields = [
            'id', 'name', 'description', 'price', 'availability',
            'discount', 'product_images'
        ]

    def get_product_images(self, instance):
        images = instance.images.all()
        return serializers.ProductImageSerializer(images, many=True).data


class ProductDetailSerializer(ModelSerializer):
    sizes = serializers.ProductVariationSerializer(many=True)
    rating = SerializerMethodField()
    product_images = SerializerMethodField()

    class Meta:
        model = models.Product
        fields = ProductSerializer.Meta.fields + [
            "description",
            "sizes",
            "rating",
            "product_images",
        ]
        read_only_fields = ProductSerializer.Meta.fields + [
            "description",
            "sizes",
            "rating",
            "product_images",
        ]

    def get_rating(self, instance):
        ratings = instance.reviews.all()
        if ratings.exists():
            average_rating = ratings.aggregate(
                models.Avg('rating'))['rating__avg']
        else:
            return 0
        return round(min(max(average_rating, 0), 5), 1)

    def get_product_images(self, instance):
        # Fetch images based on the product ID
        images = models.ProductImage.objects.filter(product=instance.id)
        return serializers.ProductImageSerializer(images, many=True).data


class CollectionsSerializer(ModelSerializer):
    sizes = serializers.ProductVariationSerializer(many=True)
    rating = SerializerMethodField()
    product_images = SerializerMethodField()
    category = SerializerMethodField()

    class Meta:
        model = models.Product
        fields = ProductSerializer.Meta.fields + [
            "description",
            "sizes",
            "rating",
            "product_images",
            "category",
        ]
        read_only_fields = ProductSerializer.Meta.fields + [
            "description",
            "sizes",
            "rating",
            "product_images",
            "category",
        ]

    def get_sizes(self, instance):
        sizes = instance.variations.all()
        return serializers.ProductVariationSerializer(sizes, many=True).data

    def get_rating(self, instance):
        ratings = instance.reviews.all()
        if ratings.exists():
            average_rating = ratings.aggregate(
                models.Avg('rating'))['rating__avg']
        else:
            return 0
        return round(min(max(average_rating, 0), 5), 1)

    def get_product_images(self, instance):
        images = models.ProductImage.objects.filter(product=instance.id)
        return serializers.ProductImageSerializer(images, many=True).data

    def get_category(self, instance):
        if instance.category:
            return serializers.CategorySerializer(instance.category).data
        return None
