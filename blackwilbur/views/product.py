from django.db.models import OuterRef, Subquery
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

    
class ExploreAPIView(APIView):
    def get(self, request):
        latest_product_per_category = models.Product.objects.filter(
            category=OuterRef('category')
        ).order_by('-created_at')
        distinct_products = models.Product.objects.filter(
            id__in=Subquery(latest_product_per_category.values('id')[:1])
        ).order_by('-created_at')[:6]
        if len(distinct_products) < 6:
            random_products = models.Product.objects.exclude(id__in=[p.id for p in distinct_products]).order_by('?')[:6 - len(distinct_products)]
            distinct_products = list(distinct_products) + list(random_products)
        distinct_products = distinct_products[:6]
        serializer = serializers.ProductSerializer(distinct_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SearchAPIView(APIView):
    def get(self, request):
        serializer = serializers.SearchProductSerializer(data=request.GET)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        response = serializer.validated_data

        products = models.Product.objects.all()
        search_term = response.get("search_term", None)
        if search_term:
            products = products.filter(name__icontains=search_term)

        return Response(serializers.ProductSerializer(products, many=True).data)