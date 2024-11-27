from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from blackwilbur.models import ShippingAddress
from blackwilbur.serializers import ShippingAddressSerializer

class ShippingAddressAPIView(APIView):
    """
    Custom API view to handle CRUD operations for ShippingAddress model.
    """

    def get(self, request, *args, **kwargs):
        """
        Retrieve all shipping addresses or filter by user ID.
        """
        user_id = request.query_params.get('user', None)
        if user_id:
            addresses = ShippingAddress.objects.filter(user__id=user_id)
        else:
            addresses = ShippingAddress.objects.all()
        
        serializer = ShippingAddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def get_object(self, pk):
        """
        Helper method to retrieve a single shipping address by ID.
        """
        try:
            return ShippingAddress.objects.get(pk=pk)
        except ShippingAddress.DoesNotExist:
            return None

    def get_by_user(self, request, pk=None):
        """
        Retrieve all shipping addresses for a specific user.
        """
        addresses = ShippingAddress.objects.filter(user=pk)
        serializer = ShippingAddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """
        Create a new shipping address.
        """
        serializer = ShippingAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, *args, **kwargs):
        """
        Delete a shipping address by ID.
        """
        address = self.get_object(pk)
        if address:
            address.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

