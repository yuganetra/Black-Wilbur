import logging
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from phonepe.sdk.pg.payments.v1.payment_client import PhonePePaymentClient
from phonepe.sdk.pg.env import Env

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

@csrf_exempt
def phonepe_callback(request):
    # Initialize context before use
    context = {}

    try:
        # Constants
        merchant_id = 'M224GLLI0GBI1'
        salt_key = 'bd10bbe8-5ec7-4093-9ab4-79e796d7e937'  # Update with correct salt key
        salt_index = 1  # Update your salt index
        env = Env.PROD  # Use the appropriate environment (UAT for testing)
        should_publish_events = True  # Set to False if events shouldn't be published

        # Create PhonePe client instance
        phonepe_client = PhonePePaymentClient(merchant_id, salt_key, salt_index, env, should_publish_events)

        # Print the initial form data received
        form_data = request.POST
        form_data_dict = dict(form_data)
        logger.debug(f"Form Data: {form_data_dict}")

        transaction_id = form_data.get('transactionId', None)
        logger.debug(f"Transaction ID: {transaction_id}")

        if transaction_id:
            # Using the PhonePe SDK to check the status
            response = phonepe_client.check_status(transaction_id)

            # Debugging output: Print the response
            logger.debug(f"Response Status: {response.success}")
            logger.debug(f"Response Message: {response.message}")

            # Prepare context data for the template
            context = {
                'transaction_id': transaction_id,
                'response_message': response.message,
                'payment_status': response.success,
            }

            if response.success and response.data:
                # Safely access the payment instrument
                payment_instrument = response.data.payment_instrument if response.data else None
                if payment_instrument:
                    if payment_instrument.type.value == "UPI":
                        context['payment_details'] = f"UPI: IFSC: {payment_instrument.ifsc}, UTR: {payment_instrument.utr}"
                    elif payment_instrument.type.value == "CARD":
                        context['payment_details'] = f"CARD: PG Transaction ID: {payment_instrument.pg_transaction_id}"
                    elif payment_instrument.type.value == "NETBANKING":
                        context['payment_details'] = f"NETBANKING: Bank ID: {payment_instrument.bank_id}"
                    return render(request, 'index.html', context)
                else:
                    context['error_message'] = "Payment instrument details missing."
                    return render(request, 'index.html', context)

            else:
                # Handle the case when the payment status is pending
                if response.data and response.data.state == 'PENDING':
                    context['payment_details'] = "Payment is pending. Please wait for confirmation."
                    return render(request, 'index.html', context)
                
                # Handle failure
                context['error_message'] = f"Payment Status Check Failed: {response.message}"
                return render(request, 'index.html', context)

        else:
            context['error_message'] = "Transaction ID is missing in the form data."
            return render(request, 'index.html', context)

    except Exception as e:
        # Log the exception and return a generic error message
        logger.error(f"Error occurred during payment callback: {str(e)}")
        context['error_message'] = f"Internal Server Error: {str(e)}"
        return render(request, 'index.html', context)
