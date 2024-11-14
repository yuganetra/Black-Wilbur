import logging
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
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
    # Constants
    merchant_id = 'M224GLLI0GBI1'
    salt_key = 'bd10bbe8-5ec7-4093-9ab4-79e796d7e937'#'96434309-7796-489d-8924-ab56988a6076'
    salt_index = 1  # Update your salt index
    env = Env.PROD    # Use the appropriate environment (UAT for testing)
    should_publish_events = True  # Set to False if events shouldn't be published
    
    # Create PhonePe client instance
    phonepe_client = PhonePePaymentClient(merchant_id, salt_key, salt_index, env, should_publish_events)
    
    # Print the initial form data received
    form_data = request.POST
    form_data_dict = dict(form_data)
    print("Form Data:", form_data_dict)
    
    transaction_id = form_data.get('transactionId', None)
    print("Transaction ID:", transaction_id)

    if transaction_id:
        # Using the PhonePe SDK to check the status
        response = phonepe_client.check_status(transaction_id)

        # Debugging output: Print the response
        print("Response Status:", response.success)
        print("Response Message:", response.message)
        
        if response.success:
            # Handle the transaction details based on the payment instrument
            if response.data:
                if response.data.payment_instrument.type.value == "UPI":
                    state = response.data.state
                    ifsc = response.data.payment_instrument.ifsc
                    utr = response.data.payment_instrument.utr
                    print(f"State: {state}, IFSC: {ifsc}, UTR: {utr}")
                
                elif response.data.payment_instrument.type.value == "CARD":
                    state = response.data.state
                    pg_transaction_id = response.data.payment_instrument.pg_transaction_id
                    pg_authorization_code = response.data.payment_instrument.pg_authorization_code
                    bank_id = response.data.payment_instrument.bank_id
                    print(f"State: {state}, PG Transaction ID: {pg_transaction_id}, Bank ID: {bank_id}")
                
                elif response.data.payment_instrument.type.value == "NETBANKING":
                    state = response.data.state
                    bank_id = response.data.payment_instrument.bank_id
                    bank_transaction_id = response.data.payment_instrument.bank_transaction_id
                    print(f"State: {state}, Bank ID: {bank_id}, Bank Transaction ID: {bank_transaction_id}")
        
        else:
            print("Error: Payment Status Check Failed")
            return HttpResponse(f"Error: Payment Status Check Failed: {response.message}", status=500)

    return render(request, 'index.html', {'output': response.message, 'main_request': form_data_dict})