from rest_framework import serializers
from blackwilbur.models import Cart

class CartSerializer(serializers.Serializer):
    class Meta:
        model = Cart
        fields = ['id', 'user']
