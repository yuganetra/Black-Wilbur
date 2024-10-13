from rest_framework import serializers

from blackwilbur.models.product_variation import SIZE_CHOICES


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required = True)
    password = serializers.CharField(required = True)

class SearchProductSerializer(serializers.Serializer):
    search_term = serializers.CharField()

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=True)
    product_variation_id = serializers.IntegerField(required=True)

class EditQuantitySerializer(serializers.Serializer):
    cart_item_id = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(required=True)

class EditQuantitySerializer(serializers.Serializer):
    cart_item_id = serializers.IntegerField(required=True)