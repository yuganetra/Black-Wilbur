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

    def post(self, request):
        serializer = serializers.AddToCartSerializer(
            data=request.data
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        response = serializer.validated_data

        try:
            cart = models.Cart.objects.get(user=request.user)
        except models.Cart.DoesNotExist:
            raise exceptions.NotFound("Cart not found!")
        try:
            product = models.Product.objects.get(pk=response.get("product_id"))
        except models.Product.DoesNotExist:
            raise exceptions.NotFound("Product not found!")
        try:
            product_variation = models.ProductVariation.objects.get(pk=response.get("product_variation_id"))
        except models.Product.DoesNotExist:
            raise exceptions.NotFound("Product size not found!")

        cart_item = models.CartItem.objects.create(
            cart=cart,
            product=product,
            product_variation=product_variation,
            quantity=1,
        )
        return Response(serializers.CartItemSerializer(cart_item).data)

    def put(self, request):
        serializer = serializers.EditQuantitySerializer(
            data=request.data
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        response = serializer.validated_data

        try:
            cart_item = models.CartItem.objects.get(pk=response.get("cart_item_id"))
        except models.CartItem.DoesNotExist:
            raise exceptions.NotFound("Cart item not found!")

        cart_item.quantity = response.get("quantity")
        cart_item.save()
        return Response(serializers.CartItemSerializer(cart_item).data)

    def delete(self, request):
        serializer = serializers.EditQuantitySerializer(
            data=request.data
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        response = serializer.validated_data

        try:
            cart_item = models.CartItem.objects.get(pk=response.get("cart_item_id"))
        except models.CartItem.DoesNotExist:
            raise exceptions.NotFound("Cart item not found!")

        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)