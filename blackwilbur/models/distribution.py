from django.db import models

class DistributionPartnership(models.Model):
    email = models.EmailField(max_length=255)
    phone = models.IntegerField(max_length=12)
