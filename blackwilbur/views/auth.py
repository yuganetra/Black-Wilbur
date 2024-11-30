from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from blackwilbur.serializers import LoginSerializer, RegisterSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from blackwilbur.models import User  # Import your User model
from django.db import IntegrityError

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

        # Authenticate the user based on email and password
        user = authenticate(request, email=email, password=password)
        if user is None:
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
                'isAdmin': user.is_superuser
            }
        }, status=status.HTTP_200_OK) 
   
class RegisterAPIView(APIView):
    def post(self, request):
        try:
            # Check if the phone number is already registered
            phone_number = request.data.get('phone_number')
            
            if phone_number is None:
                return Response({
                    'error': 'Phone number is required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(phone_number=phone_number).exists():
                return Response({
                    'error': 'Phone number is already registered.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate the request data using the serializer
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

            # Save the user and generate UUID in the serializer
            user = serializer.save()

            # Update additional fields if provided in the request
            user.phone_verified = request.data.get('phone_verified', False)
            user.terms_accepted = request.data.get('terms_accepted', False)
            user.referral_code = request.data.get('referral_code', '')
            user.gender = request.data.get('gender', None)

            # Save the user after updating these fields
            user.save()

            # Generate JWT tokens
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
                    'phone_verified': user.phone_verified,
                    'terms_accepted': user.terms_accepted,
                    'referral_code': user.referral_code,
                    'gender': user.gender,
                }
            }, status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            # Handle any database integrity issues (e.g., unique constraint violations)
            return Response({
                'error': f'Database error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            # Catch any other unexpected errors
            return Response({
                'error': f'An unexpected error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
