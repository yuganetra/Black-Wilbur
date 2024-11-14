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
        self.BASE_URL = 'https://blackwilbur.com/',#'http://localhost:3000/'#"http://blackwilbur.com/"  # Replace with your domain
        self.MERCHANT_ID = 'M224GLLI0GBI1'#'PGTESTPAYUAT86' #'M224GLLI0GBI1'
        self.SALT_KEY = 'bd10bbe8-5ec7-4093-9ab4-79e796d7e937'#'96434309-7796-489d-8924-ab56988a6076'  # Corrected
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
            "redirectUrl": 'https://api.blackwilbur.com/phonepe-callback/',#"http://127.0.0.1:8000/phonepe-callback/",#'https://blackwilbur.com/orderConfirmation', #
            "redirectMode": "POST",
            "callbackUrl": 'https://api.blackwilbur.com/phonepe-callback/',#"http://127.0.0.1:8000/phonepe-callback/",
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

        #'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
        logger.debug(f"Sending payment request to PhonePe API with headers: {headers}")
        response = requests.post(
            'https://api.phonepe.com/apis/hermes',
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
