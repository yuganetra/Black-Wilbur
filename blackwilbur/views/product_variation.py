from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from blackwilbur.models import Product, ProductVariation
from blackwilbur.serializers import ProductVariationSerializer
import uuid

class ProductVariationAPIView(APIView):

    def get(self, request):
        """Retrieve all product variations."""
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
