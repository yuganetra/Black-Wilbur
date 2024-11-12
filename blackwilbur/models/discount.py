import uuid
from django.db import models

class Discount(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    coupon = models.CharField(max_length=50, unique=True, null=True, blank=True)  # Coupon code
    percent_discount = models.DecimalField(max_digits=5, decimal_places=2)  # Percentage discount
    min_order_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Minimum order price (optional)
    quantity_threshold = models.IntegerField(null=True, blank=True)  # Minimum quantity for discount (optional)
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for creation
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp for last update

    def __str__(self):
        if self.coupon:
            return f"Coupon {self.coupon} - {self.percent_discount}%"
        elif self.quantity_threshold:
            return f"{self.percent_discount}% off on buying {self.quantity_threshold} or more"
        else:
            return f"{self.percent_discount}% off"

    class Meta:
        verbose_name = "Discount"
        verbose_name_plural = "Discounts"
