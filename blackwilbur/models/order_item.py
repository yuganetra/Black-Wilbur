import uuid
from django.db import models
from blackwilbur.models import Order, Product, ProductVariation
from decimal import Decimal

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, related_name='orderitems', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    product_variation = models.ForeignKey(ProductVariation, on_delete=models.CASCADE, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Order ID: {self.order.order_id})"

    def save(self, *args, **kwargs):
        # Set the total price for the order item manually (without calculations)
        super(OrderItem, self).save(*args, **kwargs)
