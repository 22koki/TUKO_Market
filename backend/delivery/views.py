from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from orders.models import Order
from .models import DeliveryJob
from .serializers import RiderDeliveryJobSerializer

class RiderOnly:
    def ensure_rider(self, request):
        if request.user.role != "rider":
            raise PermissionDenied("Rider account required.")

class AvailableDeliveryListView(RiderOnly, generics.ListAPIView):
    serializer_class = DeliveryJobSerializer
    def get_queryset(self):
        self.ensure_rider(self.request)
        return DeliveryJob.objects.filter(status=DeliveryJob.Status.AVAILABLE, rider__isnull=True).select_related("order").order_by("created_at")

class MyDeliveryListView(RiderOnly, generics.ListAPIView):
    serializer_class = DeliveryJobSerializer
    def get_queryset(self):
        self.ensure_rider(self.request)
        return DeliveryJob.objects.filter(rider=self.request.user).select_related("order").order_by("-created_at")

class AcceptDeliveryView(RiderOnly, APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        self.ensure_rider(request)
        job = DeliveryJob.objects.filter(pk=pk, status=DeliveryJob.Status.AVAILABLE, rider__isnull=True).first()
        if not job:
            return Response({"detail":"Delivery is no longer available."}, status=status.HTTP_409_CONFLICT)
        job.rider = request.user
        job.status = DeliveryJob.Status.ACCEPTED
        job.accepted_at = timezone.now()
        job.save(update_fields=["rider","status","accepted_at"])
        return Response(RiderDeliveryJobSerializer(job).data)

class UpdateDeliveryStatusView(RiderOnly, APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        self.ensure_rider(request)
        job = DeliveryJob.objects.filter(pk=pk, rider=request.user).select_related("order").first()
        if not job:
            return Response({"detail":"Delivery not found."}, status=status.HTTP_404_NOT_FOUND)
        action = request.data.get("action")
        if action == "picked_up" and job.status == DeliveryJob.Status.ACCEPTED:
            job.status = DeliveryJob.Status.PICKED_UP
            job.picked_up_at = timezone.now()
            job.order.status = Order.Status.OUT_FOR_DELIVERY
            job.order.save(update_fields=["status"])
        elif action == "out_for_delivery" and job.status == DeliveryJob.Status.PICKED_UP:
            job.status = DeliveryJob.Status.OUT_FOR_DELIVERY
        elif action == "delivered" and job.status in {DeliveryJob.Status.PICKED_UP, DeliveryJob.Status.OUT_FOR_DELIVERY}:
            if str(request.data.get("pin","")) != job.delivery_pin:
                return Response({"detail":"Incorrect delivery PIN."}, status=status.HTTP_400_BAD_REQUEST)
            job.status = DeliveryJob.Status.DELIVERED
            job.delivered_at = timezone.now()
            job.order.status = Order.Status.DELIVERED
            job.order.save(update_fields=["status"])
        else:
            return Response({"detail":"Invalid delivery transition."}, status=status.HTTP_400_BAD_REQUEST)
        job.save()
        return Response(RiderDeliveryJobSerializer(job).data)

class CreateReadyDeliveryJobsView(APIView):
    permission_classes = [permissions.IsAdminUser]
    def post(self, request):
        created = 0
        for order in Order.objects.filter(status=Order.Status.READY, fulfilment=Order.Fulfilment.DELIVERY):
            _, was_created = DeliveryJob.objects.get_or_create(order=order)
            created += int(was_created)
        return Response({"created":created})
