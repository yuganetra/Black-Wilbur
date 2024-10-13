from rest_framework.views import APIView
from rest_framework.response import Response

from blackwilbur import models, serializers


class OrdersAPIView(APIView):
    def get(self, request):
        orders = models.Order.objects.filter(user=request.user)
        return Response(serializers.OrderSerializer(orders, many=True).data)