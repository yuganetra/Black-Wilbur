from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from blackwilbur import models, serializers


class BestsellerAPIView(APIView):
    def get(self, request):
        most_sold_products = models.Product.objects.annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:5]

        serializer = serializers.ProductSerializer(most_sold_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)