from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from blackwilbur.serializers import LoginSerializer,RegisterSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class LoginAPIView(APIView):
    def post(self, request):
        print("Received request data:", request.data)

        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['identifier']  # Use 'identifier' for login
        password = serializer.validated_data['password']
        print(f"Attempting to authenticate user: {identifier}")

        # Use 'username' field to authenticate with either email or username
        user = authenticate(request, username=identifier, password=password)

        if user is None:
            print("Authentication failed for user:", identifier)
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        print("User authenticated successfully:", user.username)

        return Response({
            'message': 'Login successful',
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
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

        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
