from rest_framework import serializers
from blackwilbur.models import Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['product', 'rating']  # Use 'product' instead of 'product_id'

    def validate_rating(self, value):
        if not (1 <= value <= 5):  # Assuming rating is between 1 and 5
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def create(self, validated_data):
        # Ensure you can create a rating linked to a product
        return Rating.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Handle update logic for rating
        instance.rating = validated_data.get('rating', instance.rating)
        instance.save()
        return instance
