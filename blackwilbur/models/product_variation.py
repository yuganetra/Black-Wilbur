from django.db import models
from blackwilbur.models import Product

class ProductVariation(models.Model):
    SIZE_CHOICES = [
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('XXL', 'Double Extra Large'),
    ]
    product = models.ForeignKey(Product, related_name='sizes', on_delete=models.CASCADE)
    size = models.CharField(max_length=5, choices=SIZE_CHOICES)  # Define size choices
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.name} - {self.size}"
