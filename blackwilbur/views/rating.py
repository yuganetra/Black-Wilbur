from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from blackwilbur import models, serializers

class RatingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        product_id = request.query_params.get('product_id')
        print(f"GET request received for product_id: {product_id}")  # Debug print

        if not product_id:
            print("product_id is missing in the request.")  # Debug print
            return Response({"detail": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        ratings = models.Rating.objects.filter(product_id=product_id)
        print(f"Found {len(ratings)} ratings for product_id: {product_id}")  # Debug print
        return Response(serializers.RatingSerializer(ratings, many=True).data)

    def post(self, request):
        print(f"POST request received with data: {request.data}")  # Debug print

        # Ensure product ID is extracted correctly
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"detail": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a rating instance with the product and rating
        serializer = serializers.RatingSerializer(data={'product': product_id, 'rating': request.data.get('rating')})

        if not serializer.is_valid():
            print(f"Invalid data: {serializer.errors}")  # Debug print
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=request.user)  # Save the user making the rating
        print(f"Rating created for user: {request.user.id}")  # Debug print
        return Response(serializer.data, status=status.HTTP_201_CREATED)
