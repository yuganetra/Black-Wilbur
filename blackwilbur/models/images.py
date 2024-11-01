import uuid
from django.db import models

class Image(models.Model):
    IMAGE_TYPE_CHOICES = [
        ('product', 'Product Image'),
        ('carousel', 'Carousel Image'),
        ('other', 'Other Image'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product_id = models.CharField(max_length=100, blank=True, null=True, help_text="Optional product identifier")
    image_url = models.TextField(blank=True, null=True)
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPE_CHOICES, default='product')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        type_display = dict(self.IMAGE_TYPE_CHOICES).get(self.image_type, 'Unknown')
        product_name = self.product_id if self.product_id else 'No product'
        return f"{type_display} for {product_name}"
