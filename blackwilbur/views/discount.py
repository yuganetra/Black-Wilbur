from django.forms import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
        print("Received request data:", request.data)  # Debug: Print incoming request data

        serializer = DiscountSerializer(data=request.data)
        if serializer.is_valid():
            # Validate that both coupon and quantity_threshold are provided
            coupon = request.data.get('coupon')
            quantity_threshold = request.data.get('quantity_threshold')

            print(f"Coupon: {coupon}, Quantity Threshold: {quantity_threshold}")  # Debug

            if not coupon or not quantity_threshold:
                # If either field is missing, return an error
                print("Validation failed: Both coupon and quantity threshold are required.")
                return Response(
                    {"error": "Both coupon code and quantity threshold are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Save the data if validation passes
            serializer.save()
            print("Discount created successfully.")  # Debug
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Serializer errors:", serializer.errors)  # Debug
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, pk=None):
        """Update an existing discount."""
        try:
            discount = Discount.objects.get(id=pk)
        except Discount.DoesNotExist:
            return Response({"error": "Discount not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DiscountSerializer(discount, data=request.data, partial=True)
        if serializer.is_valid():
            # Custom validation to check if either coupon or quantity_threshold is provided
            coupon = request.data.get('coupon', discount.coupon)
            quantity_threshold = request.data.get('quantity_threshold', discount.quantity_threshold)

            if not coupon and not quantity_threshold:
                return Response({"error": "Either a coupon code or a quantity threshold must be provided."}, status=status.HTTP_400_BAD_REQUEST)

            if coupon and quantity_threshold:
                return Response({"error": "Coupon code and quantity threshold should not be provided together."}, status=status.HTTP_400_BAD_REQUEST)

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
