from django.db import models
from django.conf import settings
import uuid

class PaymentOrder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('cod', 'Cash on Delivery')
    ], default='pending')
    razorpay_order_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    currency = models.CharField(max_length=3, default='INR')
    receipt = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        app_label = 'blackwilbur'
        db_table = 'blackwilbur_paymentorder'

    def __str__(self):
        return f"Order {self.id} - {self.status}"

class Payment(models.Model):
    order = models.ForeignKey(PaymentOrder, on_delete=models.CASCADE)
    razorpay_payment_id = models.CharField(max_length=255)
    razorpay_signature = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=50)
    payment_method = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'blackwilbur'
        db_table = 'blackwilbur_payment'

    def __str__(self):
        return f"Payment {self.razorpay_payment_id} for Order {self.order.id}"

RAZORPAY_KEY_ID = 'rzp_test_CcaiEoRcHpwLa5'
RAZORPAY_KEY_SECRET = '56CQ6JtFime5odK2A4Vb7L1O'
RAZORPAY_CURRENCY = 'INR'