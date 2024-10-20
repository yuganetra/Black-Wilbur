from django.db import models
from blackwilbur.models import User
from blackwilbur.models import Product

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    order_id = models.CharField(max_length=255)  # Temporarily allow null
    email = models.EmailField(max_length=255)  # Allow null temporarily
    payment_method = models.CharField(max_length=50)  # Add this line
    products = models.ManyToManyField(Product, through='OrderItem')



