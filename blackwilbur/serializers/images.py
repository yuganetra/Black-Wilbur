from rest_framework import serializers
from blackwilbur import models

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Image
        fields = ['id', 'product_id', 'image_url', 'image_type', 'created_at']  # Updated field names
        read_only_fields = ['id', 'created_at']  # Make id and created_at read-only

    def validate_image_url(self, value):
        if not value:
            raise serializers.ValidationError("Image URL field cannot be empty.")
        return value
