from rest_framework.serializers import ModelSerializer, SerializerMethodField
from blackwilbur import models, serializers

class ProductSerializer(ModelSerializer):
    category = SerializerMethodField()
    class Meta:
        model = models.Product
        fields = ['id', 'name', 'description', 'category', 'price', 'image']

    def get_category(self, instance):
        if instance.category:
            # Instead of returning the full serializer, return the category name
            return instance.category.name  # Assuming `name` is the field you want
        return None


class ProductDetailSerializer(ModelSerializer):
    sizes = SerializerMethodField()  # Use a method to get sizes
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
            average_rating = ratings.aggregate(models.Avg('rating'))['rating__avg']
        else:
            return 0
        return round(min(max(average_rating, 0), 5), 1)

    def get_product_images(self, instance):
        images = models.Image.objects.filter(product=instance.id)
        return serializers.ImageSerializer(images, many=True).data

    def get_sizes(self, instance):
        # Fetch all variations related to the product UUID
        sizes = models.ProductVariation.objects.filter(product=instance.id)  # Assuming instance.id is the product UUID
        return serializers.ProductVariationSerializer(sizes, many=True).data  # Use the updated ProductVariationSerializer


class CollectionsSerializer(ModelSerializer):
    sizes = SerializerMethodField()  # Use a method to get sizes
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
        # Fetch all variations related to the product ID
        sizes = models.ProductVariation.objects.filter(product=instance.id)
        return serializers.ProductVariationSerializer(sizes, many=True).data 

    def get_rating(self, instance):
        ratings = instance.reviews.all()
        if ratings.exists():
            average_rating = ratings.aggregate(models.Avg('rating'))['rating__avg']
        else:
            return 0
        return round(min(max(average_rating, 0), 5), 1)

    def get_product_images(self, instance):
        images = models.Image.objects.filter(product=instance.id)
        return serializers.ImageSerializer(images, many=True).data

    def get_category(self, instance):
        if instance.category:
            return instance.category.name  # Return the category name
        return None

class ProductAdminSerializer(ModelSerializer):
    category = SerializerMethodField()
    class Meta:
        model = models.Product
        fields = ['id', 'name', 'description', 'category', 'price', 'image']

    def get_category(self, instance):
        if instance.category:
            # Instead of returning the full serializer, return the category name
            return instance.category.name  # Assuming `name` is the field you want
        return None