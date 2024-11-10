import uuid
from django.db import models

class Discount(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('COUPON', 'Coupon'),
        ('QUANTITY', 'Quantity-based'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    coupon = models.CharField(max_length=50, unique=True, null=True, blank=True)  # Coupon code (only for coupon-based discounts)
    percent_discount = models.DecimalField(max_digits=5, decimal_places=2)  # Percentage discount
    min_order_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Minimum order price (optional for quantity discounts)
    quantity_threshold = models.IntegerField(null=True, blank=True)  # Quantity threshold (only for quantity-based discounts)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPE_CHOICES)  # Type of discount: Coupon or Quantity-based
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for creation
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp for last update

    def __str__(self):
        if self.discount_type == 'COUPON':
            return f"{self.coupon} - {self.percent_discount}%"
        else:
            return f"Buy {self.quantity_threshold} or more - {self.percent_discount}% off"

    class Meta:
        verbose_name = "Discount"
        verbose_name_plural = "Discounts"
