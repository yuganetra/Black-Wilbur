# services/payment_service.py

import json
import requests
from django.conf import settings
from rest_framework.exceptions import ValidationError

def initiate_phonepe_payment(amount, order_id):
    PHONEPE_MERCHANT_ID = settings.PHONEPE_MERCHANT_ID
    PHONEPE_API_KEY = settings.PHONEPE_API_KEY
    PHONEPE_API_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"  # Test URL

    # Prepare the payload for the PhonePe API
    payload = {
        "merchantId": PHONEPE_MERCHANT_ID,
        "amount": amount,
        "orderId": order_id,
        "callbackUrl": "http://yourdomain.com/payment/callback/",  # Update with your callback URL
        "currency": "INR",
        "transactionType": "RETAIL",
    }

    headers = {
        "Content-Type": "application/json",
        "x-api-key": PHONEPE_API_KEY,
    }

    # Make the API request
    response = requests.post(PHONEPE_API_URL, json=payload, headers=headers)
    response_data = response.json()

    if response_data.get('code') != 'SUCCESS':
        raise ValidationError(response_data.get('message'))

    return response_data.get('paymentUrl')
