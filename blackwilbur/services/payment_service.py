import jsons
import base64
import requests
import shortuuid
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect
from cryptography.hazmat.primitives import hashes
from django.views.decorators.csrf import csrf_exempt
from cryptography.hazmat.backends import default_backend
import logging

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

class PaymentService:

    # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    ########################## HELPER FUNCTION ################################
    # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    def calculate_sha256_string(self, input_string):
        logger.debug(f"Calculating SHA-256 for: {input_string}")  # Debugging input string
        sha256 = hashes.Hash(hashes.SHA256(), backend=default_backend())
        sha256.update(input_string.encode('utf-8'))
        result = sha256.finalize().hex()
        logger.debug(f"SHA-256 Result: {result}")  # Debugging result
        return result

    def base64_encode(self, input_dict):
        logger.debug(f"Base64 encoding input dictionary: {input_dict}")  # Debugging input
        json_data = jsons.dumps(input_dict)
        data_bytes = json_data.encode('utf-8')
        encoded_string = base64.b64encode(data_bytes).decode('utf-8')
        logger.debug(f"Base64 Encoded String: {encoded_string}")  # Debugging output
        return encoded_string

    # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    ########################## Views ###########################################
    # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    def pay(self, amount, user_id, mobile_number):
        logger.debug(f"Initiating payment for user_id={user_id}, amount={amount}, mobile_number={mobile_number}")

        MAINPAYLOAD = {
            "merchantId": 'M224GLLI0GBI1',#'PGTESTPAYUAT86', # # Replace with actual Merchant ID
            "merchantTransactionId": shortuuid.uuid(),
            "merchantUserId": user_id,
            "amount": amount,  # Change from 1 to actual amount
            "redirectUrl": "https://blackwilbur.com/orderConfirmation",
            "redirectMode": "POST",
            "callbackUrl": "https://blackwilbur.com/orderFaliure",
            "mobileNumber": mobile_number,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }

        INDEX = "1"
        ENDPOINT = "/pg/v1/pay"
        SALTKEY = 'bd10bbe8-5ec7-4093-9ab4-79e796d7e937'#'099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'  # Replace with actual Salt Key

        # Call instance methods
        base64String = self.base64_encode(MAINPAYLOAD)
        mainString = base64String + ENDPOINT + SALTKEY
        sha256Val = self.calculate_sha256_string(mainString)
        checkSum = sha256Val + '###' + INDEX

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
            'https://api.phonepe.com/apis/hermes/pg/v1/pay', headers=headers, json=json_data)
            ##'https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay', headers=headers, json=json_data)

        if response.status_code != 200:
            logger.error(f"Request failed with status code {response.status_code}")
            return HttpResponse(f"Error: Request failed with status code {response.status_code}", status=500)

        responseData = response.json()

        logger.debug(f"Response Data: {responseData}")  # Debugging the full response

        try:
            url = responseData['data']['instrumentResponse']['redirectInfo']['url']
            logger.debug(f"Redirect URL: {url}")  # Debugging URL
            return HttpResponse(f"Payment URL: {url}")  # Return the URL in the response
        except KeyError:
            logger.error("Missing 'instrumentResponse' in response data.")
            return HttpResponse("Error: Missing 'instrumentResponse' in response data.", status=500)


    @csrf_exempt
    def check_payment_status(self, request):
        # Process payment status check
        INDEX = "1"
        SALTKEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"

        form_data = request.POST
        form_data_dict = dict(form_data)
        transaction_id = form_data.get('transactionId', None)

        if transaction_id:
            # request_url = f'https://api.phonepe.com/apis/hermes/pg/v1/pay/status/PGTESTPAYUAT/{transaction_id}'
            request_url = f'https://api.phonepe.com/apis/hermes/pg/v1/pay/status/PGTESTPAYUAT/{transaction_id}'
           # request_url = f'https://api.phonepe.com/apis/hermes/pg/v1/pay/status/PGTESTPAYUAT/{transaction_id}'
            sha256_Pay_load_String = f'/pg/v1/status/PGTESTPAYUAT/{transaction_id}{SALTKEY}'
            sha256_val = self.calculate_sha256_string(sha256_Pay_load_String)
            checksum = sha256_val + '###' + INDEX

            headers = {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': transaction_id,
                'accept': 'application/json',
            }

            response = requests.get(request_url, headers=headers)
            if response.status_code != 200:
                return HttpResponse(f"Error: Request failed with status code {response.status_code}", status=500)

            return render(request, 'payment_status.html', {'output': response.text, 'main_request': form_data_dict})
        else:
            return HttpResponse("Error: Missing transaction ID.", status=400)
