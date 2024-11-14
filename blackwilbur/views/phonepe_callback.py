from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import base64
from blackwilbur.services import PaymentService
import logging

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# This view will handle the PhonePe callback
@csrf_exempt
def phonepe_callback(request):
    if request.method == "POST":
        try:
            # Log the raw request body to help debug the issue
            logger.debug(f"Raw request body: {request.body.decode('utf-8')}")
            
            # The callback data from PhonePe
            callback_data = json.loads(request.body)
            logger.debug(f"Received callback data: {callback_data}")
            
            # Extract relevant data
            received_checksum = request.headers.get('X-VERIFY')  # PhonePe checksum header
            response_data = callback_data.get("response")  # The response from PhonePe
            
            if not response_data:
                logger.error("Missing 'response' field in callback data.")
                return JsonResponse({'status': 'failure', 'message': 'Missing response field'}, status=400)
            
            # Decode the response from base64
            decoded_response = base64.b64decode(response_data).decode('utf-8')
            logger.debug(f"Decoded Response: {decoded_response}")
            
            # Verify the checksum
            payment_service = PaymentService()  # Instantiate your PaymentService class
            computed_checksum = payment_service.calculate_sha256_string(decoded_response + '###' + payment_service.SALT_KEY)
            
            if received_checksum != computed_checksum:
                logger.error(f"Checksum mismatch: received {received_checksum}, computed {computed_checksum}")
                return JsonResponse({'status': 'failure', 'message': 'Checksum mismatch'}, status=400)
            
            # Parse the payment status from the callback data
            payment_status = callback_data.get("status")  # You need to confirm how PhonePe provides this status
            
            if payment_status == "success":
                # Process successful payment here (update the order, etc.)
                logger.info("Payment successful")
                # Add your code to process successful payments, e.g., update order status
                return JsonResponse({'status': 'success', 'message': 'Payment successful'}, status=200)
            else:
                # Handle payment failure (e.g., log it or update the database accordingly)
                logger.info("Payment failed")
                return JsonResponse({'status': 'failure', 'message': 'Payment failed'}, status=200)

        except Exception as e:
            logger.error(f"Error processing callback: {e}", exc_info=True)
            return JsonResponse({'status': 'failure', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'failure', 'message': 'Invalid method'}, status=405)
