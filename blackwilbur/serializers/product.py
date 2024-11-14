from rest_framework.serializers import ModelSerializer, SerializerMethodField
from blackwilbur import models, serializers
from django.db.models import Avg

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


    def get_rating(self, product):
        # Fetch all ratings for this product and calculate the average rating
        ratings = product.reviews.all()  # Assuming 'reviews' is the related_name for the Rating model
        average_rating = ratings.aggregate(Avg('rating'))['rating__avg']
        return average_rating

    def get_sizes(self, instance):
        # Fetch all variations related to the product UUID
        sizes = models.ProductVariation.objects.filter(product=instance.id)  # Assuming instance.id is the product UUID
        return serializers.ProductVariationSerializer(sizes, many=True).data  # Use the updated ProductVariationSerializer


class CollectionsSerializer(ModelSerializer):
    sizes = SerializerMethodField()  # Use a method to get sizes
    rating = SerializerMethodField()
    category = SerializerMethodField()

    class Meta:
        model = models.Product
        fields = ProductSerializer.Meta.fields + [
            "sizes",
            "rating",
            "category",
        ]
        read_only_fields = ProductSerializer.Meta.fields + [
            "sizes",
            "rating",
            "category",
        ]

    def get_sizes(self, instance):
        # Fetch all variations related to the product ID
        sizes = models.ProductVariation.objects.filter(product=instance.id)
        return serializers.ProductVariationSerializer(sizes, many=True).data 

    def get_rating(self, product):
        # Fetch all ratings for this product and calculate the average rating
        ratings = product.reviews.all()  # Assuming 'reviews' is the related_name for the Rating model
        average_rating = ratings.aggregate(Avg('rating'))['rating__avg']
        return average_rating

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