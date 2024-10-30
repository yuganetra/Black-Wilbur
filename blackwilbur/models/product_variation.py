import uuid
from django.db import models
from blackwilbur.models import Product

SIZE_CHOICES = [
    ('S', 'Small'),
    ('M', 'Medium'),
    ('L', 'Large'),
    ('XL', 'Extra Large'),
    ('XXL', 'Double Extra Large'),
]

class ProductVariation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    product = models.UUIDField()  # Assuming this stores the product UUID
    size = models.CharField(max_length=5, choices=SIZE_CHOICES)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.name} - {self.size}"
