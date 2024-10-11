from rest_framework import serializers
from blackwilbur.models import DistributionPartnership

class DistributionPartnershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributionPartnership
        fields = ['id', 'email', 'phone']
