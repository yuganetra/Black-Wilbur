from django.db import models
from blackwilbur.models import User

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
