from rest_framework import serializers

from blackwilbur import models


class ProductVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductVariation
        fields = [ 'size' ]
        read_only_fields = [ 'size' ]