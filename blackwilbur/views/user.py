from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from blackwilbur.serializers import UserSerializer

# Define the API view to list all users
class UserListAPIView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access this

