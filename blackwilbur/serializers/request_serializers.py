from rest_framework import serializers
from blackwilbur.models.user import User
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        user = User(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required = True)
    password = serializers.CharField(required = True)

class SearchProductSerializer(serializers.Serializer):
    search_term = serializers.CharField()

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=True)
    product_variation_id = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(default=1)  


class EditQuantitySerializer(serializers.Serializer):
    cart_item_id = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(required=True)
