from rest_framework import serializers
from blackwilbur import models

class ProductVariationSerializer(serializers.ModelSerializer):
    product = serializers.UUIDField()  # Keep this to accept a UUID

    class Meta:
        model = models.ProductVariation
        fields = ['id', 'product', 'size', 'quantity']

    def validate_product(self, value):
        # Ensure the product exists in the database
        if not models.Product.objects.filter(id=value).exists():
            raise serializers.ValidationError("Product does not exist.")
        return value

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value

    def create(self, validated_data):
        # Create a ProductVariation instance with only the product ID, size, and quantity
        product_variation = models.ProductVariation(
            product=validated_data['product'],  # Use product_id to save the UUID
            size=validated_data['size'],
            quantity=validated_data['quantity']
        )
        product_variation.save()
        return product_variation
