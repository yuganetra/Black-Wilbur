import os
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from azure.storage.blob import BlobServiceClient
import uuid
from blackwilbur import models
from blackwilbur import serializers

CONTAINER_NAME = 'blackwilbur-image'
AZURE_STORAGE_CONNECTION_STRING = os.getenv('AZURE_STORAGE_CONNECTION_STRING')

class ImageManageAPIView(APIView):
    blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)

    def get(self, request, pk=None, product_id=None):
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
            images = models.Image.objects.filter(product_id=product_id)  # Query images by product ID
            serializer = serializers.ImageSerializer(images, many=True)
            if not images:
                print("No images found for this product.")
                return Response({"error": "No images found for this product."}, status=status.HTTP_404_NOT_FOUND)
        else:
            print("Fetching all images.")
            images = models.Image.objects.all()
            serializer = serializers.ImageSerializer(images, many=True)
        
        return Response(serializer.data)


    def post(self, request):
        print("POST request received.")
        product_id = request.data.get('product')
        print(f"Product ID from request: {product_id}")

        image_file = request.FILES.get('image')
        if not image_file:
            print("Error: No image file provided.")
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

        image_uuid = uuid.uuid4()
        print(f"Generated UUID for image: {image_uuid}")

        # Use the product name to create the blob URL
        image_url = self.create_blob_url(product_id, image_uuid)
        print(f"Generated blob URL: {image_url}")

        image_instance = models.Image(product_id=product_id, image_url=image_url)
        image_instance.save()
        print("Image instance saved to database.")

        # Upload image to blob with folder structure
        self.upload_image_to_blob(product_id, image_uuid, image_file)
        print("Image uploaded to Azure Blob Storage.")

        serializer = serializers.ImageSerializer(image_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        print("DELETE request received.")
        image_id = request.data.get('id')  # Get the ID from the request body
        if not image_id:
            return Response({"error": "Image ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the image instance from the database
            image = models.Image.objects.get(id=image_id)
            
            # Construct the blob name to delete
            product_name = self.format_product_name(self.get_product_name(image.product.id))
            blob_name = image.image_url.split('/')[-1]  # Get the last part which is the blob name
            full_blob_name = f"{product_name}/{blob_name}"  # Assuming product_name is formatted correctly

            # First, delete the image from the database
            image.delete()
            print("Image deleted from database.")

            # Now delete the blob from Azure Storage
            blob_client = self.blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=full_blob_name)
            blob_client.delete_blob()
            print(f"Image deleted from blob storage with blob name: {full_blob_name}")

            return Response(status=status.HTTP_204_NO_CONTENT)
        except models.Image.DoesNotExist:
            print("Image not found in the database.")
            return Response({"error": "Image not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error during deletion: {str(e)}")
            return Response({"error": "An error occurred while deleting the image."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create_blob_url(self, product_id, image_uuid):
        # Fetch the product name based on the product ID
        product_name = self.get_product_name(product_id)
        sanitized_product_name = self.format_product_name(product_name)
        blob_url = f"https://{self.blob_service_client.account_name}.blob.core.windows.net/{CONTAINER_NAME}/{sanitized_product_name}/{image_uuid}.jpg"
        print(f"Blob URL created: {blob_url}")
        return blob_url

    def upload_image_to_blob(self, product_id, image_uuid, image_file):
        # Fetch the product name based on the product ID
        product_name = self.get_product_name(product_id)
        sanitized_product_name = self.format_product_name(product_name)
        blob_name = f"{sanitized_product_name}/{image_uuid}.jpg"  # Include product name in the blob path
        blob_client = self.blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=blob_name)

        # Upload the image to the specified folder
        blob_client.upload_blob(image_file, overwrite=True)
        print(f"Image uploaded to blob storage with blob name: {blob_name}")

    def get_product_name(self, product_id):
        try:
            product = models.Product.objects.get(id=product_id)
            return product.name
        except models.Product.DoesNotExist:
            return "Unknown Product"

    def format_product_name(self, product_name):
        product_name = product_name.strip()  
        formatted_name = product_name.lower().replace(" ", "-")
        if formatted_name.endswith('-'):
            formatted_name = formatted_name[:-1]
        return formatted_name
