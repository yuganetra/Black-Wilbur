from django.forms import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from blackwilbur.models import Discount
from blackwilbur.serializers import DiscountSerializer

class DiscountAPIView(APIView):
    def get(self, request):
        """Retrieve all discounts, a specific discount by ID, or by coupon code."""
        coupon_code = request.query_params.get('coupon_code', None)
        discount_id = request.query_params.get('id', None)

        # Check for `coupon_code` parameter to filter by coupon code
        if coupon_code:
            try:
                discount = Discount.objects.get(coupon=coupon_code)  # Use the correct field name 'coupon'
                serializer = DiscountSerializer(discount)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Discount.DoesNotExist:
                return Response({"error": "Discount with the specified coupon code not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Check for `id` parameter to filter by ID
        if discount_id:
            try:
                discount = Discount.objects.get(id=discount_id)
                serializer = DiscountSerializer(discount)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Discount.DoesNotExist:
                return Response({"error": "Discount not found."}, status=status.HTTP_404_NOT_FOUND)

        # If no filters are applied, return all discounts
        discounts = Discount.objects.all()
        serializer = DiscountSerializer(discounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new discount."""
        serializer = DiscountSerializer(data=request.data)
        if serializer.is_valid():
            # Custom validation to check if discount_type and fields are valid
            discount_type = request.data.get('discount_type')
            if discount_type == 'COUPON' and 'coupon' not in request.data:
                return Response({"error": "Coupon code is required for COUPON type discount."}, status=status.HTTP_400_BAD_REQUEST)
            if discount_type == 'QUANTITY' and 'quantity_threshold' not in request.data:
                return Response({"error": "Quantity threshold is required for QUANTITY type discount."}, status=status.HTTP_400_BAD_REQUEST)

            # Ensure that 'coupon' is not provided for 'QUANTITY' type discounts
            if discount_type == 'QUANTITY' and 'coupon' in request.data:
                return Response({"error": "Coupon code should not be provided for QUANTITY type discount."}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        """Update an existing discount."""
        try:
            discount = Discount.objects.get(id=pk)
        except Discount.DoesNotExist:
            return Response({"error": "Discount not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DiscountSerializer(discount, data=request.data, partial=True)
        if serializer.is_valid():
            # Custom validation to check if discount_type and fields are valid
            discount_type = request.data.get('discount_type', discount.discount_type)
            if discount_type == 'COUPON' and 'coupon' not in request.data:
                return Response({"error": "Coupon code is required for COUPON type discount."}, status=status.HTTP_400_BAD_REQUEST)
            if discount_type == 'QUANTITY' and 'quantity_threshold' not in request.data:
                return Response({"error": "Quantity threshold is required for QUANTITY type discount."}, status=status.HTTP_400_BAD_REQUEST)

            # Ensure that 'coupon' is not provided for 'QUANTITY' type discounts
            if discount_type == 'QUANTITY' and 'coupon' in request.data:
                return Response({"error": "Coupon code should not be provided for QUANTITY type discount."}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete a discount by its ID passed in the body."""
        id = request.data.get('id')  # Retrieve the ID from the request body

        if not id:
            raise ValidationError("ID is required.")

        try:
            discount = Discount.objects.get(id=id)
            discount.delete()  # Delete the discount
            return Response({"message": "Discount deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Discount.DoesNotExist:
            return Response({"error": "Discount not found."}, status=status.HTTP_404_NOT_FOUND)
