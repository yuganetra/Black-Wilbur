from rest_framework import serializers
from blackwilbur import models

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Image  # Updated model name
        fields = ['id', 'product', 'image_url', 'created_at']  # Updated fields
        read_only_fields = ['id', 'created_at']  # Make id and created_at read-only

    def validate_url(self, value):
        if not value:
            raise serializers.ValidationError("URL field cannot be empty.")
        return value
