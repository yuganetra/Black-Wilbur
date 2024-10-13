from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions

from blackwilbur import models, serializers


class CartAPIView(APIView):
    def get(self, request):
        try:
            cart = models.Cart.objects.get(user=request.user)
        except models.Cart.DoesNotExist:
            raise exceptions.NotFound("Cart not found!")

        cart_items = models.CartItem.objects.filter(cart=cart)
        return Response(serializers.CartItemSerializer(cart_items, many=True).data)