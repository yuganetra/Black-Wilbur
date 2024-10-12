from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from blackwilbur import models, serializers

class CategoryAPIView(APIView):
    def get(self, request):
        try:
            categories = models.Category.objects.all()
        except Exception as e:
            return Response("Categories not found.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializers.CategorySerializer(categories, many=True).data)

