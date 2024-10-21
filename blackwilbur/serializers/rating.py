from rest_framework import serializers
from blackwilbur.models import Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['product', 'rating']  # Ensure to include 'product' field instead of 'product_id'
