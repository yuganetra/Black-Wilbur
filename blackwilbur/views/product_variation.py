from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from blackwilbur.models import Product, ProductVariation
from blackwilbur.serializers import ProductVariationSerializer
import uuid

class ProductVariationAPIView(APIView):

    def get(self, request, pk=None, product_id=None):
        """Retrieve a specific product variation by ID (pk) or variations by product ID."""
        if pk:
            # Fetching a specific product variation by its primary key (pk)
            print(f"Fetching product variation with ID: {pk}")
            try:
                variation = ProductVariation.objects.get(id=pk)
                serializer = ProductVariationSerializer(variation)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ProductVariation.DoesNotExist:
                print("ProductVariation not found.")
                return Response({"error": "ProductVariation not found."}, status=status.HTTP_404_NOT_FOUND)

        elif product_id:
            # Fetching all variations associated with a specific product ID
            print(f"Fetching product variations for product ID: {product_id}")
            variations = ProductVariation.objects.filter(product_id=product_id)
            if not variations.exists():
                print("No product variations found for this product.")
                return Response({"error": "No product variations found for this product."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ProductVariationSerializer(variations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            # If no parameters are provided, fetch all product variations
            print("Fetching all product variations.")
            variations = ProductVariation.objects.all()
            serializer = ProductVariationSerializer(variations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request):
        # Use the serializer to validate and create a new ProductVariation
        serializer = ProductVariationSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()  # This will call the create method in the serializer
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request):
        """Update an existing product variation."""
        variation_id = request.data.get('id')  # Get ID from request body
        try:
            variation = ProductVariation.objects.get(id=variation_id)
        except ProductVariation.DoesNotExist:
            return Response({"error": "ProductVariation not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductVariationSerializer(variation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        """Partially update an existing product variation."""
        variation_id = request.data.get('id')  # Get ID from request body
        try:
            variation = ProductVariation.objects.get(id=variation_id)
        except ProductVariation.DoesNotExist:
            return Response({"error": "ProductVariation not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductVariationSerializer(variation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete an existing product variation."""
        variation_id = request.data.get('id')  # Get ID from request body
        try:
            variation = ProductVariation.objects.get(id=variation_id)
            variation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductVariation.DoesNotExist:
            return Response({"error": "ProductVariation not found."}, status=status.HTTP_404_NOT_FOUND)
