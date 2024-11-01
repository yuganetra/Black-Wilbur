from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'first_name', 'last_name', 'phone_number', 'email')  # Specify the fields you want to serialize
        read_only_fields = ('id',)  # Make 'id' read-only, adjust as needed

    def validate_email(self, value):
        """Validate the email to ensure it's unique."""
        User = get_user_model()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_phone_number(self, value):
        """Validate the username to ensure it's unique."""
        User = get_user_model()
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("This phone_number is already taken.")
        return value
