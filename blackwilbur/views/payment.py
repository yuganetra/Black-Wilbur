import logging
import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.payment import PaymentOrder, Payment
from django.shortcuts import get_object_or_404
import uuid

# Set up a logger
logger = logging.getLogger(__name__)

class CreateRazorpayOrderView(APIView):
    def post(self, request):
        try:
            # Log incoming request data
            logger.debug(f"Request data: {request.data}")

            # Validate request data
            amount = request.data.get('amount')
            order_id = request.data.get('order_id')
            user_id = request.data.get('user_id')
            print("user_id",user_id);
            if not amount or not order_id:
                logger.warning('Amount or order_id is missing in the request')
                return Response({
                    'error': 'Amount and order_id are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Convert string UUID to UUID object
                order_uuid = uuid.UUID(order_id)
            except ValueError:
                return Response({
                    'error': 'Invalid order ID format'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Initialize Razorpay client
            logger.debug(f"Initializing Razorpay client with key: {settings.RAZORPAY_KEY_ID}")
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            # Generate receipt (ensure it is less than or equal to 40 characters)
            receipt = f'rcpt_{str(order_uuid)[:8]}'  # Use first 8 chars of UUID

            # Check if PaymentOrder exists or create new one
            order, created = PaymentOrder.objects.get_or_create(
                id=order_uuid,
                user_id=user_id,
                defaults={
                    'total_amount': float(amount),
                    'status': 'pending',
                }
            )

            if created:
                logger.debug(f"Created new PaymentOrder with ID: {order_uuid}")
            else:
                logger.debug(f"Found existing PaymentOrder with ID: {order_uuid}")

            # Create Razorpay order
            try:
                data = {
                    'amount': int(float(amount) * 100),  # Convert to paise
                    'currency': settings.RAZORPAY_CURRENCY,
                    'receipt': receipt,
                    'payment_capture': 1
                }
                razorpay_order = client.order.create(data=data)
                logger.debug(f"Razorpay order created: {razorpay_order}")
            except razorpay.errors.BadRequestError as e:
                logger.error(f"Razorpay error: {str(e)}")
                return Response({
                    'error': 'Invalid payment details',
                    'details': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

            # Update order in database with Razorpay order ID
            order.razorpay_order_id = razorpay_order['id']
            order.save()
            logger.debug(f"Order updated with Razorpay order ID: {razorpay_order['id']}")

            return Response({
                'order_id': razorpay_order['id'],
                'key_id': settings.RAZORPAY_KEY_ID,
                'amount': data['amount'],
                'currency': data['currency'],
            })

        except Exception as e:
            logger.exception(f"Payment initialization failed: {str(e)}")
            return Response({
                'error': 'Payment initialization failed',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyPaymentView(APIView):
    def post(self, request):
        try:
            # Log incoming request data
            logger.debug(f"Request data: {request.data}")

            # Get payment details from request
            razorpay_payment_id = request.data.get('razorpay_payment_id')
            razorpay_order_id = request.data.get('razorpay_order_id')
            razorpay_signature = request.data.get('razorpay_signature')

            # Initialize Razorpay client
            logger.debug(f"Initializing Razorpay client with key: {settings.RAZORPAY_KEY_ID}")
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            # Verify signature
            params_dict = {
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_order_id': razorpay_order_id,
                'razorpay_signature': razorpay_signature
            }
            try:
                logger.debug(f"Verifying payment signature: {params_dict}")
                client.utility.verify_payment_signature(params_dict)
                logger.debug("Payment signature verified successfully.")
            except razorpay.errors.SignatureVerificationError:
                logger.error(f"Invalid payment signature for payment ID: {razorpay_payment_id}")
                return Response({
                    'error': 'Invalid payment signature'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Update order status
            try:
                order = PaymentOrder.objects.get(razorpay_order_id=razorpay_order_id)
                order.status = 'paid'
                order.save()
               


                logger.debug(f"Order status updated to 'paid' for order ID: {razorpay_order_id}")
            except PaymentOrder.DoesNotExist:
                logger.error(f"Order with Razorpay order ID {razorpay_order_id} not found.")
                return Response({
                    'error': 'Order not found'
                }, status=status.HTTP_404_NOT_FOUND)

            # Create payment record
            Payment.objects.create(
                order=order,
                razorpay_payment_id=razorpay_payment_id,
                razorpay_signature=razorpay_signature,
                amount=order.total_amount,
                payment_status='success',
                payment_method='razorpay'
            )
        
            logger.debug(f"Payment record created for payment ID: {razorpay_payment_id}")

            return Response({'success': True, 'order_id': order.id})

        except Exception as e:
            logger.exception(f"Payment verification failed: {str(e)}")
            return Response({
                'error': 'Payment verification failed',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
