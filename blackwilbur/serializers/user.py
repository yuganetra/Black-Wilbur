from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'first_name', 'last_name', 'username', 'email')  # Specify the fields you want to serialize
        read_only_fields = ('id',)  # Make 'id' read-only, adjust as needed

    def validate_email(self, value):
        """Validate the email to ensure it's unique."""
        User = get_user_model()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        """Validate the username to ensure it's unique."""
        User = get_user_model()
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value
