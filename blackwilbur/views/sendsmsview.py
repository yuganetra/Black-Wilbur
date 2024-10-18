from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from blackwilbur.utils import send_sms
from blackwilbur.serializers import SendSmsSerializer

class SendSmsView(APIView):
    def post(self, request):
        serializer = SendSmsSerializer(data=request.data)
        
        if serializer.is_valid():
            otp = serializer.validated_data['otp']
            numbers = serializer.validated_data['numbers']
            
            result = send_sms(otp, numbers)
            
            if result.get("return"):
                return Response({"message": "SMS sent successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": result.get("message")}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
