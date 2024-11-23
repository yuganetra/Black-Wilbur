from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions
from rest_framework.permissions import IsAuthenticated
from blackwilbur import models, serializers
import uuid  # Import the uuid module

class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        cart, created = models.Cart.objects.get_or_create(user=user)

        cart_items = models.CartItem.objects.filter(cart=cart)
        return Response(serializers.CartItemSerializer(cart_items, many=True).data)

    def post(self, request):
        serializer = serializers.AddToCartSerializer(data=request.data)

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
            product_variation = models.ProductVariation.objects.get(
                pk=response.get("product_variation_id"))
        except models.ProductVariation.DoesNotExist:
            raise exceptions.NotFound("Product size not found!")

        # Generate a UUID for the new cart item
        cart_item = models.CartItem.objects.create(
            id=uuid.uuid4(),  # Assign the generated UUID as the primary key
            cart=cart,
            product=product,
            product_variation=product_variation,
            quantity=1,
        )

        return Response(serializers.CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)

    def put(self, request):
        """
        Update the quantity of a specific cart item
        """
        try:

            # Get the data directly from request.data
            cart_item_id = request.data.get("cart_item_id")
            quantity = request.data.get("quantity")

            # Validate required fields
            if not cart_item_id or not quantity:
                return Response(
                    {"error": "cart_item_id and quantity are required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Convert quantity to integer and validate
            try:
                quantity = int(quantity)
                if quantity < 1:
                    return Response(
                        {"error": "Quantity must be at least 1"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except (ValueError, TypeError):
                return Response(
                    {"error": "Quantity must be a valid number"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the cart item and verify ownership
            cart_item = models.CartItem.objects.get(
                pk=cart_item_id,
                cart__user=request.user
            )

            # Check if requested quantity is available in stock
            if cart_item.product_variation.quantity < quantity:
                return Response(
                    {
                        "error": "Requested quantity not available in stock",
                        "available_quantity": cart_item.product_variation.quantity
                    }, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update the quantity
            cart_item.quantity = quantity
            cart_item.save()

            # Return updated cart item data
            return Response(
                {
                    "message": "Quantity updated successfully",
                    "cart_item": serializers.CartItemSerializer(cart_item).data
                },
                status=status.HTTP_200_OK
            )

        except models.CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found or you don't have permission to update it"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to update quantity: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request):
        """
        Delete a specific cart item while preserving the cart
        """
        # If no cart_item_id is provided, return an error instead of deleting the cart
        if not request.data:
            return Response(
                {"error": "cart_item_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item_id = request.data.get("cart_item_id")
        
        if not cart_item_id:
            return Response(
                {"error": "cart_item_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the user's cart
        try:
            cart = models.Cart.objects.get(user=request.user)
        except models.Cart.DoesNotExist:
            return Response(
                {"error": "Cart not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Find and delete only the specific cart item
        try:
            cart_item = models.CartItem.objects.filter(
                pk=cart_item_id,
                cart=cart  # Ensure the item belongs to the user's cart
            ).first()

            if not cart_item:
                return Response(
                    {"error": "Cart item not found or you don't have permission to delete it"}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # Delete only the cart item, not the cart
            cart_item.delete()

            # Return remaining cart items
            remaining_items = models.CartItem.objects.filter(cart=cart)
            return Response(
                {
                    "message": "Cart item successfully deleted",
                    "remaining_items": serializers.CartItemSerializer(remaining_items, many=True).data
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": f"Failed to delete cart item: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )