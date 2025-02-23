import uuid  # Import the uuid module
from django.db.models import Max, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions
from blackwilbur import models, serializers
from azure.storage.blob import BlobServiceClient
import re
from decimal import Decimal, InvalidOperation
import uuid
from PIL import Image
import io

class BestsellerAPIView(APIView):
    def get(self, request):
        most_sold_products = models.Product.objects.annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:5]

        serializer = serializers.ProductSerializer(most_sold_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExploreAPIView(APIView):
    def get(self, request):
        # Get the latest product IDs for each category
        latest_product_ids = (
            models.Product.objects.values('category')
            .annotate(latest_product_id=Max('id'))
            .values_list('latest_product_id', flat=True)
        )
        

        # Fetch distinct products based on the latest IDs
        distinct_products = models.Product.objects.filter(
            id__in=latest_product_ids
        )[:7]  # Fetch the first 6 products without any specific order

        # If there are fewer than 6 products, fetch random additional products
        if len(distinct_products) < 7:
            additional_products_count = 7 - len(distinct_products)
            random_products = models.Product.objects.exclude(
                id__in=[p.id for p in distinct_products]
            ).order_by('?')[:additional_products_count]
            distinct_products = list(distinct_products) + list(random_products)

        # Limit the result to a maximum of 6 products
        distinct_products = distinct_products[:7]

        # Serialize the products
        serializer = serializers.ProductSerializer(distinct_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchAPIView(APIView):
    def get(self, request):
        serializer = serializers.SearchProductSerializer(data=request.GET)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        response = serializer.validated_data

        products = models.Product.objects.all()
        search_term = response.get("search_term", None)
        if search_term:
            products = products.filter(name__icontains=search_term)

        return Response(serializers.ProductSerializer(products, many=True).data)


class ProductDetailAPIView(APIView):
    def get(self, request, product_id):
        try:
            product = models.Product.objects.get(pk=product_id)
        except models.Product.DoesNotExist:
            raise exceptions.NotFound("Product not found!")

        return Response(serializers.ProductDetailSerializer(product).data)


class CollectionAPIView(APIView):
    def get(self, request):
        all_products = models.Product.objects.all()
        serializer = serializers.CollectionsSerializer(all_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
CONTAINER_NAME = 'blackwilbur-image'
AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=blackwilbur;AccountKey=Vv2HZ0MjxWAibKuMgX6E3TmntwvLNHZz+lQpswpEvoXtuHdXP/M9OOoMv43rADP1xiYvpd33XI4O+AStYbhjXw==;EndpointSuffix=core.windows.net'

class ProductManageAPIView(APIView):
    blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)

    def get(self, request, pk=None):
            if pk:
                # Fetch a single product by ID
                product = models.Product.objects.get(id=pk)
                serializer = serializers.ProductAdminSerializer(product)
            else:
                # Fetch all products
                products = models.Product.objects.all()
                serializer = serializers.ProductAdminSerializer(products, many=True)
            
            return Response(serializer.data)

    def post(self, request):
        # Extract product fields from request data
        name = request.data.get('name')
        description = request.data.get('description')
        price_str = request.data.get('price')
        category_id = request.data.get('category')
        
        sanitized_price_str = re.sub(r'[^\d.-]', '', price_str)  # Remove any character that is not a number, dot or hyphen
        try:
            # Convert sanitized price string to Decimal
            price = Decimal(sanitized_price_str)
        except (ValueError, InvalidOperation):
            return Response({"error": "Invalid price value"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate UUID for the new product ID
        product_id = uuid.uuid4()

        # Retrieve the category object
        try:
            category = models.Category.objects.get(id=category_id)
        except serializers.Category.DoesNotExist:
            return Response({"error": "Invalid category_id"}, status=status.HTTP_400_BAD_REQUEST)

        # Get image file from the request
        image = request.FILES.get('image')
        if image:
            # Create a blob URL for the image before uploading
            image_url = self.create_blob_url(product_id, name)
        else:
            image_url = None

        # Save product to the database with the image URL
        product = models.Product.objects.create(
            id=product_id,
            name=name,
            description=description,
            price=price,
            category=category,
            image=image_url  # Save the blob URL for the image
        )

        # Upload the image to blob storage after saving the product
        if image:
            self.upload_image_to_blob(product_id, name, image)

        # Serialize and return the product data
        serializer = serializers.ProductAdminSerializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        try:
            # Fetch the product by its ID (pk)
            product = models.Product.objects.get(id=pk)
        except models.Product.DoesNotExist:
            # Return a 404 response if the product doesn't exist
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the updated data (using partial=True to allow partial updates)
        serializer = serializers.ProductAdminSerializer(product, data=request.data, partial=True)

        # Check if the serialized data is valid
        if serializer.is_valid():
            # Get the image from the request (if it exists)
            image = request.FILES.get('image')

            # If a new image is provided, upload it and update the product's image URL
            if image:
                # Generate the image URL
                product.image = self.create_blob_url(product.id, product.name)

                # Upload the image (check if it exists first and overwrite if necessary)
                self.upload_image_to_blob(product.id, product.name, image)

            # Save the updated product data
            serializer.save()

            # Return the updated product data as a response
            return Response(serializer.data, status=status.HTTP_200_OK)

        # If there are validation errors, return a 400 response with the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request):
            product_id = request.data.get('id')  # Get product ID from request body
            print("Received request to delete product with id:", product_id)  # Debugging print statement
            try:
                product = models.Product.objects.get(id=product_id)
                product.delete()
                print("Product deleted successfully.")  # Debugging print statement
                return Response(status=status.HTTP_204_NO_CONTENT)
            except models.Product.DoesNotExist:
                print("Product with id", product_id, "does not exist.")  # Debugging print statement
                return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

    def create_blob_url(self, product_id, product_name):
        # Create blob URL path without duplicating the container name in the path
        sanitized_product_name = product_name.replace(" ", "-").lower()
        blob_url = f"https://{self.blob_service_client.account_name}.blob.core.windows.net/{CONTAINER_NAME}/{sanitized_product_name}/{product_id}.jpg"
        return blob_url

    # def upload_image_to_blob(self, product_id, product_name, image_file):
    # # Set up the blob path without duplicating container name in the path
    #     sanitized_product_name = self.format_product_name(product_name)
    #     blob_name = f"{sanitized_product_name}/{product_id}.jpg"  # Use product ID as file name with .jpg extension

    #     # Open the image using Pillow
    #     image = Image.open(image_file)

    #     # Save the image to a buffer with compression
    #     image_buffer = io.BytesIO()
    #     image.save(image_buffer, format="JPEG", quality=85)  # Adjust the quality (lower = more compression)
    #     image_buffer.seek(0)

    #     # Retrieve the blob client
    #     blob_client = self.blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=blob_name)

    #     # Upload the compressed image
    #     blob_client.upload_blob(image_buffer, overwrite=True)
    def upload_image_to_blob(self, product_id, product_name, image_file):
        # Sanitize product name to prevent issues with spaces or special characters
        sanitized_product_name = self.format_product_name(product_name)
        
        # Define the blob name using the sanitized product name and product ID
        blob_name = f"{sanitized_product_name}/{product_id}.jpg"  # Use product ID as the file name with .jpg extension

        # Retrieve the blob client for the specified container and blob
        blob_client = self.blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=blob_name)
        
        # Check if the blob already exists
        try:
            # Try to fetch the blob (this will throw an error if the blob doesn't exist)
            blob_client.get_blob_properties()
            image_exists = True
        except Exception as e:
            # If an error is thrown (blob not found), we know the image does not exist
            image_exists = False

        # If the image already exists, we will overwrite it
        if image_exists:
            print(f"Image already exists. Overwriting the existing image: {blob_name}")
        else:
            print(f"Uploading new image: {blob_name}")

        # Open the image using Pillow to handle the file
        image = Image.open(image_file)

        # Save the image to a buffer with compression
        image_buffer = io.BytesIO()
        image.save(image_buffer, format="JPEG", quality=85)  # Adjust quality for compression
        image_buffer.seek(0)

        # Upload the image (overwrite if exists)
        blob_client.upload_blob(image_buffer, overwrite=True)  # `overwrite=True` ensures the image is updated

    def format_product_name(self, product_name):
        # Convert to lowercase and replace spaces with hyphens
        product_name = product_name.strip()  # Remove leading and trailing spaces
        formatted_name = product_name.lower().replace(" ", "-")  # Replace spaces with hyphens
        # Handle trailing hyphen if needed
        if formatted_name.endswith('-'):
            formatted_name = formatted_name[:-1]
        return formatted_name