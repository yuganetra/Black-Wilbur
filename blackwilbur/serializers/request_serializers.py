import uuid
from rest_framework import serializers
from blackwilbur.models.user import User
from blackwilbur.models import ProductVariation ,Category   # Import for product variation validation
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
            email=validated_data['email'],
            id=uuid.uuid4() 
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True) 
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        return attrs


class SearchProductSerializer(serializers.Serializer):
    search_term = serializers.CharField()


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.UUIDField(required=True)  # Use UUIDField for product ID
    product_variation_id = serializers.UUIDField(required=True)  # Use UUIDField for variation ID
    quantity = serializers.IntegerField(default=1)


class EditQuantitySerializer(serializers.Serializer):
    cart_item_id = serializers.UUIDField(required=True)  # Use UUIDField for cart item ID
    quantity = serializers.IntegerField(required=True)


class EditCategory(serializers.Serializer):
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=False)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance

class CreateCategorySerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False)  # Allow id to be optional during creation
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=False)

    def create(self, validated_data):
        # Generate a UUID and assign it to the id field
        validated_data['id'] = uuid.uuid4()
        
        # Create the category instance
        category = Category(**validated_data)
        category.save()
        return category

class SendSmsSerializer(serializers.Serializer):
    otp = serializers.CharField(required=True, max_length=8)  
    numbers = serializers.ListField(
        child=serializers.CharField(max_length=15),
        required=True
    )
