from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
import jsons
import base64
import requests
import shortuuid
import logging
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from django.shortcuts import redirect

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

class PaymentService:
    def __init__(self):
        self.BASE_URL = "http://blackwilbur.com/"  # Replace with your domain
        self.MERCHANT_ID = 'M224GLLI0GBI1'
        self.SALT_KEY = 'bd10bbe8-5ec7-4093-9ab4-79e796d7e937'
        self.INDEX = "1"

    def calculate_sha256_string(self, input_string):
        logger.debug(f"Calculating SHA-256 for: {input_string}")
        sha256 = hashes.Hash(hashes.SHA256(), backend=default_backend())
        sha256.update(input_string.encode('utf-8'))
        result = sha256.finalize().hex()
        logger.debug(f"SHA-256 Result: {result}")
        return result

    def base64_encode(self, input_dict):
        logger.debug(f"Base64 encoding input dictionary: {input_dict}")
        json_data = jsons.dumps(input_dict)
        data_bytes = json_data.encode('utf-8')
        encoded_string = base64.b64encode(data_bytes).decode('utf-8')
        logger.debug(f"Base64 Encoded String: {encoded_string}")
        return encoded_string

    def pay(self, amount, user_id, mobile_number):
        logger.debug(f"Initiating payment for user_id={user_id}, amount={amount}, mobile_number={mobile_number}")
        
        transaction_id = shortuuid.uuid()
        
        MAINPAYLOAD = {
            "merchantId": self.MERCHANT_ID,
            "merchantTransactionId": transaction_id,
            "merchantUserId": user_id,
            "amount": amount,
            "redirectUrl":'https://blackwilbur.com/orderConfirmation', #"http://localhost:5000/payment/redirect/",
            "redirectMode": "POST",
            "callbackUrl": "https://blackwilbur.com/orderFailure",
            "mobileNumber": mobile_number,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }

        ENDPOINT = "/pg/v1/pay"

        base64String = self.base64_encode(MAINPAYLOAD)
        mainString = base64String + ENDPOINT + self.SALT_KEY
        sha256Val = self.calculate_sha256_string(mainString)
        checkSum = sha256Val + '###' + self.INDEX

        headers = {
            'Content-Type': 'application/json',
            'X-VERIFY': checkSum,
            'accept': 'application/json',
        }

        json_data = {
            'request': base64String,
        }

        logger.debug(f"Sending payment request to PhonePe API with headers: {headers}")
        response = requests.post(
            'https://api.phonepe.com/apis/hermes/pg/v1/pay',
            headers=headers,
            json=json_data
        )

        if response.status_code != 200:
            logger.error(f"Request failed with status code {response.status_code}")
            return HttpResponse(f"Error: Request failed with status code {response.status_code}", status=500)

        responseData = response.json()
        logger.debug(f"Response Data: {responseData}")

        try:
            url = responseData['data']['instrumentResponse']['redirectInfo']['url']
            logger.debug(f"Redirect URL: {url}")
            return HttpResponse(f"Payment URL: {url}")  # Return the URL in the response
        except KeyError:
            logger.error("Missing 'instrumentResponse' in response data.")
            return HttpResponse("Error: Missing 'instrumentResponse' in response data.", status=500)

    def check_payment_status(self, transaction_id):
        print(f"Checking payment status for transaction ID: {transaction_id}")
        
        # Updated request URL for the Check Status API
        request_url = f'https://api.phonepe.com/apis/hermes/pg/v1/pay/status/{self.MERCHANT_ID}/{transaction_id}'
        
        # Calculating SHA-256 checksum
        sha256_Pay_load_String = f'/pg/v1/status/{self.MERCHANT_ID}/{transaction_id}{self.SALT_KEY}'
        sha256_val = self.calculate_sha256_string(sha256_Pay_load_String)
        checksum = sha256_val + '###' + self.INDEX

        # Setting the headers for the request
        headers = {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': self.MERCHANT_ID,
            'accept': 'application/json',
        }
        
        # Debugging output
        print(f"Request URL: {request_url}")
        print(f"Checksum: {checksum}")
        
        # Making the GET request to check payment status
        response = requests.get(request_url, headers=headers)
        
        # Debugging response output
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Content: {response.text}")
        
        return response

@csrf_exempt
def payment_redirect(request):
    print("""Handle the redirect from PhonePe after payment""")
    if request.method == 'POST':
        transaction_id = request.POST.get('transactionId')
        merchant_id = request.POST.get('merchantId')
        
        logger.debug(f"Received POST request - Transaction ID: {transaction_id}, Merchant ID: {merchant_id}")
        
        # Verify the payment status
        payment_service = PaymentService()
        status_response = payment_service.check_payment_status(transaction_id)
        
        if status_response.status_code == 200:
            status_data = status_response.json()
            logger.debug(f"Payment status response: {status_data}")
            
            if status_data.get('code') == 'PAYMENT_SUCCESS':
                # Payment successful - redirect to success page
                logger.debug("Payment successful - redirecting to success page")
                return redirect('http://localhost:3000/orderConfirmation')
            else:
                # Payment failed - redirect to failure page
                logger.debug("Payment failed - redirecting to failure page")
                return redirect('http://localhost:3000/orderFailure')
        else:
            # Error checking status - redirect to error page
            logger.error(f"Error checking payment status - status code: {status_response.status_code}")
            return HttpResponse("Invalid request method", status=405)
    
    return HttpResponse("Invalid request method", status=405)


@csrf_exempt
def payment_callback(request):
    print("""Handle the server-to-server callback from PhonePe""")
    if request.method == 'POST':
        try:
            # Log the callback data
            logger.info(f"Received callback data: {request.POST}")
            
            # Extract transaction details
            transaction_id = request.POST.get('transactionId')
            merchant_id = request.POST.get('merchantId')
            transaction_status = request.POST.get('code')
            
            logger.debug(f"Transaction ID: {transaction_id}")
            logger.debug(f"Merchant ID: {merchant_id}")
            logger.debug(f"Transaction Status: {transaction_status}")
            
            if transaction_status == 'PAYMENT_SUCCESS':
                # Update your database with payment success
                logger.debug("Payment success - updating database")
                return JsonResponse({
                    "success": True,
                    "message": "Callback processed successfully"
                })
            else:
                # Handle failed payment
                logger.debug(f"Payment failed with status: {transaction_status}")
                return JsonResponse({
                    "success": False,
                    "message": f"Payment failed with status: {transaction_status}"
                })
                
        except Exception as e:
            logger.error(f"Error processing callback: {str(e)}")
            return JsonResponse({
                "success": False,
                "message": "Error processing callback"
            }, status=500)
    
    return JsonResponse({
        "success": False,
        "message": "Invalid request method"
    }, status=405)