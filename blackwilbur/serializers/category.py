from rest_framework import serializers
from blackwilbur.models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']  # Include 'name' and 'description' as writable fields
        read_only_fields = ['id']  # Only make 'id' read-only

    def validate_name(self, value):
        if not value.strip():  # Check if the value is empty or just whitespace
            raise serializers.ValidationError("Name field cannot be empty.")
        return value

    def validate_description(self, value):
        if not value.strip():  # Ensure the description is not empty or whitespace
            raise serializers.ValidationError("Description field cannot be empty.")
        return value
