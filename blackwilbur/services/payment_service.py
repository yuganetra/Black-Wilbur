import uuid
from phonepe.sdk.pg.payments.v1.payment_client import PhonePePaymentClient
from phonepe.sdk.pg.payments.v1.models.request.pg_pay_request import PgPayRequest
from phonepe.sdk.pg.env import Env
from django.conf import settings

class PaymentService:
    def __init__(self):
        print("Initializing PaymentService...")
        try:
            self.merchant_id = settings.PHONEPE_MERCHANT_ID
            self.salt_key = settings.PHONEPE_SALT_KEY
            self.salt_index = 1
            self.env = Env.UAT  # Change to PROD when going live
            print(f"Merchant ID: {self.merchant_id}")
            print(f"Salt Key: {self.salt_key}")
            self.client = PhonePePaymentClient(
                merchant_id=self.merchant_id,
                salt_key=self.salt_key,
                salt_index=self.salt_index,
                env=self.env
            )
            print("PhonePePaymentClient initialized successfully.")
        except Exception as e:
            print(f"Error initializing PaymentService: {e}")

    def initiate_payment(self, amount, user_id):
        try:
            print("Initiating payment...")
            unique_transaction_id = str(uuid.uuid4())[:-2]
            ui_redirect_url = "https://www.merchant.com/redirectPage"
            s2s_callback_url = "https://www.merchant.com/callback"

            pay_page_request = PgPayRequest.pay_page_pay_request_builder(
                merchant_transaction_id=unique_transaction_id,
                amount=amount,
                merchant_user_id=user_id,
                callback_url=s2s_callback_url,
                redirect_url=ui_redirect_url
            )

            # Initiate the payment
            response = self.client.pay(pay_page_request)
            print(f"Payment response: {response}")
            print(f"response.data.instrument_response.redirect_info.url: {response.data.instrument_response.redirect_info.url}")
            
            return response.data.instrument_response.redirect_info.url
        except Exception as e:
            print(f"Error during payment initiation: {e}")

    def check_payment_status(self, merchant_transaction_id):
        try:
            print("Checking payment status...")
            response = self.client.check_status(merchant_transaction_id)
            if response.success:
                print(f"Transaction Status: {response.data.state}")

                # Check the payment instrument type and handle accordingly
                payment_instrument = response.data.payment_instrument

                if payment_instrument.type.value == "UPI":
                    state = response.data.state
                    ifsc = payment_instrument.ifsc
                    utr = payment_instrument.utr
                    print(f"UPI Transaction: State: {state}, IFSC: {ifsc}, UTR: {utr}")

                elif payment_instrument.type.value == "CARD":
                    state = response.data.state
                    pg_transaction_id = payment_instrument.pg_transaction_id
                    pg_authorization_code = payment_instrument.pg_authorization_code
                    bank_id = payment_instrument.bank_id
                    print(f"Card Transaction: State: {state}, PG Transaction ID: {pg_transaction_id}, Bank ID: {bank_id}")

                elif payment_instrument.type.value == "NETBANKING":
                    state = response.data.state
                    bank_id = payment_instrument.bank_id
                    bank_transaction_id = payment_instrument.bank_transaction_id
                    print(f"NetBanking Transaction: State: {state}, Bank ID: {bank_id}, Bank Transaction ID: {bank_transaction_id}")

                return response.data
            else:
                print(f"Error checking status: {response.message}")
                return None
        except Exception as e:
            print(f"Error during payment status check: {e}")
            return None