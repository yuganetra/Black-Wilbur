from django.db.models import Max, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions

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
        latest_products = models.Product.objects.values('category').annotate(
            latest_product_id=Max('id')
        ).values_list('latest_product_id', flat=True)
        distinct_products = models.Product.objects.filter(
            id__in=latest_products
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

# class ProductsAPIView(APIView):
#     def get(self, request):


class ProductDetailAPIView(APIView):
    def get(self, request, product_id):
        try:
            product = models.Product.objects.get(pk=product_id)
        except models.Product.DoesNotExist:
            raise exceptions.NotFound("Product not found!")
        
        return Response(serializers.ProductDetailSerializer(product).data)