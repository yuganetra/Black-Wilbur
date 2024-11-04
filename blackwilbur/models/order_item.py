import uuid
from django.db import models
from blackwilbur.models import Order, Product, ProductVariation

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    product_variation = models.ForeignKey(ProductVariation, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Order ID: {self.order.order_id})"

    @property
    def subtotal(self):
        return self.quantity * self.product.price
