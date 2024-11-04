import os
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from azure.storage.blob import BlobServiceClient
import uuid
from blackwilbur import models
from blackwilbur import serializers

CONTAINER_NAME = 'blackwilbur-image'
AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=blackwilbur;AccountKey=Vv2HZ0MjxWAibKuMgX6E3TmntwvLNHZz+lQpswpEvoXtuHdXP/M9OOoMv43rADP1xiYvpd33XI4O+AStYbhjXw==;EndpointSuffix=core.windows.net'
class ImageManageAPIView(APIView):

    def get_blob_service_client(self):
        # Create a new blob service client
        return BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)

    def get(self, request, pk=None, product_id=None):
        image_type = request.query_params.get('image_type')
        blob_service_client = self.get_blob_service_client()

        if pk:
            print(f"Fetching image with ID: {pk}")
            try:
                image = models.Image.objects.get(id=pk)
                serializer = serializers.ImageSerializer(image)
            except models.Image.DoesNotExist:
                print("Image not found.")
                return Response(status=status.HTTP_404_NOT_FOUND)
        elif product_id:
            print(f"Fetching images for product ID: {product_id}")
            images = models.Image.objects.filter(product_id=product_id)
            if image_type:
                images = images.filter(image_type=image_type)
            serializer = serializers.ImageSerializer(images, many=True)
            if not images:
                print("No images found for this product.")
                return Response({"error": "No images found for this product."}, status=status.HTTP_404_NOT_FOUND)
        elif image_type:
            print(f"Fetching all images of type: {image_type}")
            images = models.Image.objects.filter(image_type=image_type)
            serializer = serializers.ImageSerializer(images, many=True)
            if not images:
                print("No images found for this type.")
                return Response({"error": "No images found for this type."}, status=status.HTTP_404_NOT_FOUND)
        else:
            print("Fetching all images.")
            images = models.Image.objects.all()
            serializer = serializers.ImageSerializer(images, many=True)

        return Response(serializer.data)

    def post(self, request):
        print("POST request received.")
        product_id = request.data.get('product')
        image_type = request.data.get('image_type', 'product')
        print(f"Product ID from request: {product_id}")
        print(f"Image Type from request: {image_type}")

        image_file = request.FILES.get('image')
        if not image_file:
            print("Error: No image file provided.")
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

        image_uuid = uuid.uuid4()
        print(f"Generated UUID for image: {image_uuid}")

        # Create the blob URL with product name if available
        image_url = self.create_blob_url(product_id, image_uuid)
        print(f"Generated blob URL: {image_url}")

        image_instance = models.Image(product_id=product_id, image_url=image_url, image_type=image_type)
        image_instance.save()
        print("Image instance saved to database.")

        # Upload image to blob with folder structure
        self.upload_image_to_blob(product_id, image_uuid, image_file)
        print("Image uploaded to Azure Blob Storage.")

        serializer = serializers.ImageSerializer(image_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        print("DELETE request received.")
        image_id = request.data.get('id')
        if not image_id:
            return Response({"error": "Image ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the image instance from the database
            image = models.Image.objects.get(id=image_id)
            
            # Construct the blob name to delete
            blob_name = self.construct_blob_name(image.product_id, image.id)
            print(f"Deleting blob with name: {blob_name}")

            # Delete image from database
            image.delete()
            print("Image deleted from database.")

            # Delete blob from Azure Storage
            blob_service_client = self.get_blob_service_client()
            blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=blob_name)
            blob_client.delete_blob()
            print(f"Image deleted from blob storage with blob name: {blob_name}")

            return Response(status=status.HTTP_204_NO_CONTENT)
        except models.Image.DoesNotExist:
            print("Image not found in the database.")
            return Response({"error": "Image not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error during deletion: {str(e)}")
            return Response({"error": "An error occurred while deleting the image."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create_blob_url(self, product_id, image_uuid):
        product_name = self.get_product_name(product_id)
        sanitized_product_name = self.format_product_name(product_name)
        blob_url = f"https://{self.get_blob_service_client().account_name}.blob.core.windows.net/{CONTAINER_NAME}/{sanitized_product_name}/{image_uuid}.jpg"
        print(f"Blob URL created: {blob_url}")
        return blob_url

    def upload_image_to_blob(self, product_id, image_uuid, image_file):
        product_name = self.get_product_name(product_id)
        sanitized_product_name = self.format_product_name(product_name)
        blob_name = f"{sanitized_product_name}/{image_uuid}.jpg"
        blob_service_client = self.get_blob_service_client()
        blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=blob_name)
        blob_client.upload_blob(image_file, overwrite=True)
        print(f"Image uploaded to blob storage with blob name: {blob_name}")

    def get_product_name(self, product_id):
        try:
            product = models.Product.objects.get(id=product_id)
            return product.name
        except models.Product.DoesNotExist:
            return "Unknown Product"

    def format_product_name(self, product_name):
        formatted_name = product_name.strip().lower().replace(" ", "-")
        return formatted_name.rstrip('-')

    def construct_blob_name(self, product_id, image_uuid):
        product_name = self.get_product_name(product_id)
        sanitized_product_name = self.format_product_name(product_name)
        return f"{sanitized_product_name}/{image_uuid}.jpg"