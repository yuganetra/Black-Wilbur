from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from blackwilbur.serializers import LoginSerializer, RegisterSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from blackwilbur.models import User  # Import your User model

class LoginAPIView(APIView):
    def post(self, request):
        print("Received request data:", request.data)

        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']  # Use 'identifier' for login
        password = serializer.validated_data['password']
        print(f"Attempting to authenticate user: {email}")

        # Try to retrieve the user by UUID or username/email
        try:
            # Try to get user by UUID
            user = User.objects.get(email=email)
        except (User.DoesNotExist, ValueError):
            # If not found by UUID, try authenticating with username/email
            user = authenticate(request, email=email, password=password)

        if user is None:
            print("Authentication failed for user:", email)
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        print("User authenticated successfully:", user.username)

        return Response({
            'message': 'Login successful',
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
            'user': {
                'id': str(user.id),  # Convert UUID to string
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
                'email': user.email,
            }
        }, status=status.HTTP_200_OK)


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            # Structure the error response more clearly
            errors = serializer.errors  # This contains the validation errors
            error_response = {
                'error': {
                    field: messages for field, messages in errors.items()
                }
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()  # Save user and generate UUID in the serializer

        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
            'user': {
                'id': str(user.id),  # Convert UUID to string
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
                'email': user.email,
            }
        }, status=status.HTTP_201_CREATED)
