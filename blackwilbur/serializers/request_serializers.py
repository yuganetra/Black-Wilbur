from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required = True)
    password = serializers.CharField(required = True)

class SearchProductSerializer(serializers.Serializer):
    search_term = serializers.CharField()