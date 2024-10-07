from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from blackwilbur.models import Category

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    availability = models.BooleanField(default=True)  # Added availability field
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    discount = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)]
    )    

    def __str__(self):
        return self.name
    