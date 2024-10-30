import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from blackwilbur.models import Category

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")  # FK to Category
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(blank=True, null=True)  # URL of the image in Azure Blob Storage

    def __str__(self):
        return self.name