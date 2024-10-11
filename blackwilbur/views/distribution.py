from rest_framework import viewsets
from blackwilbur.models import DistributionPartnership
from blackwilbur.serializers import DistributionPartnershipSerializer
from rest_framework.response import Response
from rest_framework import status

class DistributionPartnershipViewSet(viewsets.ModelViewSet):
    queryset = DistributionPartnership.objects.all()
    serializer_class = DistributionPartnershipSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
