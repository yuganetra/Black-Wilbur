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
from django.conf import settings
import re

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

class PaymentService:
    WHITELISTED_DOMAINS = [
        'https://api.blackwilbur.com/'
    ]

    def __init__(self):
        # self.BASE_URL = 'https://blackwilbur.com/'
        self.MERCHANT_ID = 'M224GLLI0GBI1'
        self.SALT_KEY = 'bd10bbe8-5ec7-4093-9ab4-79e796d7e937'
        self.INDEX = "1"

    # def validate_and_modify_domain(self, request):
    #     """
    #     Check if the domain is whitelisted; if not, modify the request to use a whitelisted domain.
    #     """
    #     referer = request.META.get('HTTP_REFERER', '')
    #     logger.debug(f"Validating domain. Referer received: {referer}")

    #     # Check if the referer is in the whitelist
    #     if any(domain in referer for domain in self.WHITELISTED_DOMAINS):
    #         logger.info(f"Request is from a whitelisted domain: {referer}")
    #         return request
    #     else:
    #         logger.warning(f"Request is from an unauthorized domain: {referer}")
    #         logger.info(f"Modifying the referer to use the whitelisted domain: {self.BASE_URL}")

    #         # Modify the request to use a whitelisted domain
    #         original_referer = referer if referer else "No referer provided"
    #         request.META['HTTP_REFERER'] = self.BASE_URL

    #         # Log the modification explicitly
    #         logger.debug(f"Original Referer: {original_referer}")
    #         logger.debug(f"Modified Referer: {request.META['HTTP_REFERER']}")
    #         return request

        
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

    def pay(self, request, amount, user_id, mobile_number):
        # Domain validation
        # if not self.validate_and_modify_domain(request):
        #     logger.error(f"Unauthorized domain: {request.META.get('HTTP_REFERER', 'No referrer')}")
        #     return HttpResponse("Unauthorized domain", status=403)
        
        logger.debug(f"Initiating payment for user_id={user_id}, amount={amount}")
        
        transaction_id = shortuuid.uuid()
                
        MAINPAYLOAD = {
            "merchantId": self.MERCHANT_ID,
            "merchantTransactionId": transaction_id,
            "merchantUserId": user_id,
            "amount": amount,
            "redirectUrl": 'https://blackwilbur.com/api/phonepe-callback/',
            "redirectMode": "POST",
            "callbackUrl": 'https://blackwilbur.com/api/phonepe-callback/',
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
        logger.debug(f"Sending POST request to PhonePe API.")
        logger.debug(f"requests: {requests}")
        logger.debug(f"URL: {'https://api.phonepe.com/apis/hermes/pg/v1/pay'}")
        logger.debug(f"Headers: {headers}")
        logger.debug(f"Request Payload: {json_data}")

        try:
            response = requests.post(
                'https://api.phonepe.com/apis/hermes/pg/v1/pay',
                headers=headers,
                json=json_data
            )

            response.raise_for_status()  # Raise exception for bad status codes
            response.raise_for_status()  # Raise exception for bad status codes
            logger.debug(f"Response Data: {response.json()}")

            return response.json()  # Return the full JSON response

        except requests.RequestException as e:
            logger.error(f"Payment request failed: {str(e)}")
            return {"error": str(e), "status": 500}

        #     responseData = response.json()
        #     logger.debug(f"Response Data: {responseData}")

        #     url = responseData.get('data', {}).get('instrumentResponse', {}).get('redirectInfo', {}).get('url')
        #     if not url:
        #         logger.error("No redirect URL in response")
        #         return HttpResponse("Payment initialization failed", status=500)

        #     logger.debug(f"Redirect URL: {url}")
        #     return HttpResponse(responseData)

        # except requests.RequestException as e:
        #     logger.error(f"Payment request failed: {str(e)}")
        #     return HttpResponse(f"Payment request error: {str(e)}", status=500)