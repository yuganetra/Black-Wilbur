import uuid
from django.db import models
from blackwilbur.models import Product
from django.conf import settings  # Recommended way to get user model

class Rating(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Use settings.AUTH_USER_MODEL
    rating = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} rated {self.product.name} with {self.rating}"
