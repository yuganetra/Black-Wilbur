from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from azure.storage.blob import BlobServiceClient
import uuid
from blackwilbur import models
from blackwilbur import serializers
from PIL import Image
import io

CONTAINER_NAME = 'blackwilbur-image'
AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=blackwilbur;AccountKey=Vv2HZ0MjxWAibKuMgX6E3TmntwvLNHZz+lQpswpEvoXtuHdXP/M9OOoMv43rADP1xiYvpd33XI4O+AStYbhjXw==;EndpointSuffix=core.windows.net'
class ImageManageAPIView(APIView):

    def get(self, request, pk=None, product_id=None):
        # Get image_type from query parameters and validate
        image_type = request.query_params.get('image_type')
        if image_type and not isinstance(image_type, str):
            return Response({"error": "Invalid image_type provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check for pk and fetch single image
            if pk:
                image = models.Image.objects.get(id=pk)
                serializer = serializers.ImageSerializer(image)
                return Response(serializer.data, status=status.HTTP_200_OK)

            # Fetch images based on product_id and/or image_type
            images = models.Image.objects.all()  # Default to all images

            if product_id:
                images = images.filter(product_id=product_id)

            if image_type:
                images = images.filter(image_type=image_type)

            # If no images found, return empty list with 200 status
            if not images.exists():
                return Response([], status=status.HTTP_200_OK)

            # Serialize and return images
            serializer = serializers.ImageSerializer(images, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except models.Image.DoesNotExist:
            return Response({"error": "Image not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "An error occurred while fetching images."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # def post(self, request):
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

        # Compress the image
        try:
            image = Image.open(image_file)
            image_buffer = io.BytesIO()
            image.save(image_buffer, format="JPEG", quality=85)  # Compress the file size
            image_buffer.seek(0)
            print("Image successfully compressed.")
        except Exception as e:
            print(f"Error during image compression: {e}")
            return Response({"error": "Failed to process the image."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save the image instance to the database
        image_instance = models.Image(product_id=product_id, image_url=image_url, image_type=image_type)
        image_instance.save()
        print("Image instance saved to database.")

        # Upload the compressed image to the blob
        self.upload_image_to_blob(product_id, image_uuid, image_buffer)
        print("Image uploaded to Azure Blob Storage.")

        # Serialize and return the response
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
    
    def get_blob_service_client(self):
        # Create a BlobServiceClient using the connection string
        return BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)

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

    def put(self, request):
        """
        Update an existing image in blob storage and database.
        
        Expected request data:
        - id: ID of the existing image to update
        - product: (optional) new product ID
        - image: new image file
        - image_type: (optional) new image type
        """
        print("PUT request received for image update.")
        
        # Validate required parameters
        image_id = request.data.get('id')
        if not image_id:
            return Response({"error": "Image ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the existing image instance
            existing_image = models.Image.objects.get(id=image_id)
            
            # Check if a new image file is provided
            new_image_file = request.FILES.get('image')
            if not new_image_file:
                return Response({"error": "New image file is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Generate a new UUID for the image
            new_image_uuid = uuid.uuid4()
            
            # Determine product ID (use existing or new)
            product_id = request.data.get('product', existing_image.product_id)
            
            # Create new blob URL
            new_image_url = self.create_blob_url(product_id, new_image_uuid)
            
            # Compress the new image
            try:
                image = Image.open(new_image_file)
                image_buffer = io.BytesIO()
                image.save(image_buffer, format="JPEG", quality=85)  # Compress the file size
                image_buffer.seek(0)
                print("New image successfully compressed.")
            except Exception as e:
                print(f"Error during image compression: {e}")
                return Response({"error": "Failed to process the new image."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Delete the old blob from Azure Storage
            try:
                # Construct the old blob name
                old_blob_name = self.construct_blob_name(existing_image.product_id, existing_image.id)
                blob_service_client = self.get_blob_service_client()
                blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=old_blob_name)
                blob_client.delete_blob()
                print(f"Old image deleted from blob storage: {old_blob_name}")
            except Exception as e:
                print(f"Warning: Could not delete old blob - {str(e)}")

            # Upload the new image to blob storage
            self.upload_image_to_blob(product_id, new_image_uuid, image_buffer)
            
            # Update image instance in database
            existing_image.product_id = product_id
            existing_image.image_url = new_image_url
            existing_image.image_type = request.data.get('image_type', existing_image.image_type)
            existing_image.save()
            
            print("Image updated successfully.")
            
            # Serialize and return the updated image
            serializer = serializers.ImageSerializer(existing_image)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except models.Image.DoesNotExist:
            return Response({"error": "Image not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error during image update: {str(e)}")
            return Response({"error": "An error occurred while updating the image."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)