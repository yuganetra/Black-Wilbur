from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions
from rest_framework.permissions import IsAuthenticated
from blackwilbur import models, serializers
import uuid  # Import UUID module

class CategoryAPIView(APIView):
    
    def get(self, request):
        # Fetch all categories (optional, if you want to allow listing categories)
        categories = models.Category.objects.all()
        return Response(serializers.CategorySerializer(categories, many=True).data)

    def post(self, request):
        serializer = serializers.CreateCategorySerializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()  # Save the instance with the overridden create method
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        print("Request data:", request.data)  # Print the full request data for debugging
        category_id = request.data.get("id")
        print(f"PUT request for category ID: {category_id}")

        if not category_id:
            print("No category ID provided.")
            return Response({"error": "category_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.get('data', {})
        print(f"Data to update category: {data}")  # Debug print for data

        serializer = serializers.EditCategory(data=data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)  # Print errors for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = models.Category.objects.get(pk=category_id)
        except models.Category.DoesNotExist:
            raise exceptions.NotFound("Category not found!")

        # Update the category with validated data
        category.name = serializer.validated_data.get('name', category.name)
        category.description = serializer.validated_data.get('description', category.description)
        category.save()

        return Response(serializers.CategorySerializer(category).data, status=status.HTTP_200_OK)

    def delete(self, request):
        category_id = request.data.get("id")  # Get category ID from request data
        print(f"DELETE request for category ID: {category_id}")  # Debug print for the category ID

        if not category_id:
            print("No category ID provided for deletion.")  # Debug print
            return Response({"error": "category_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = models.Category.objects.get(pk=category_id)
            print(f"Category found for deletion: {category}")  # Print the category found
        except models.Category.DoesNotExist:
            print(f"Category with ID {category_id} does not exist for deletion.")  # Print if category is not found
            raise exceptions.NotFound("Category not found!")

        category.delete()
        print("Category deleted successfully.")
        return Response(status=status.HTTP_204_NO_CONTENT)
