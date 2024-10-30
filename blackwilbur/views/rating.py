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

        # Check for product_id
        if not product_id:
            print("product_id is missing in the request.")  # Debug print
            return Response({"detail": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch ratings for the product
        ratings = models.Rating.objects.filter(product_id=product_id)
        print(f"Found {ratings.count()} ratings for product_id: {product_id}")  # Debug print
        
        # Serialize ratings
        serializer = serializers.RatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        print(f"POST request received with data: {request.data}")  # Debug print

        # Extract product ID from request data
        product_id = request.data.get('product_id')
        if not product_id:
            print("product_id is missing in the request.")  # Debug print
            return Response({"detail": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Extract rating from request data
        rating_value = request.data.get('rating')
        if rating_value is None:
            print("Rating value is missing in the request.")  # Debug print
            return Response({"detail": "rating value is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a rating instance
        serializer = serializers.RatingSerializer(data={'product': product_id, 'rating': rating_value})
        if not serializer.is_valid():
            print(f"Invalid data: {serializer.errors}")  # Debug print
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Save the rating with the user context
        serializer.save(user=request.user)
        print(f"Rating created for user: {request.user.id} for product: {product_id}")  # Debug print
        return Response(serializer.data, status=status.HTTP_201_CREATED)
