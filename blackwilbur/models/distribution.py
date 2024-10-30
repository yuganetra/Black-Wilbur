import uuid
from django.db import models

class DistributionPartnership(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=12, blank=True, null=True)
