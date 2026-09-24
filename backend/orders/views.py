from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from .models import Order
from .serializers import CreateOrderSerializer, OrderSerializer

class OrderListCreateView(generics.ListCreateAPIView):
    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).prefetch_related("items__vendor").order_by("-created_at")
    def get_serializer_class(self):
        return CreateOrderSerializer if self.request.method == "POST" else OrderSerializer
    def perform_create(self, serializer):
        if self.request.user.role != "customer":
            raise PermissionDenied("Only customers can place orders.")
        self.order = serializer.save()
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = OrderSerializer(self.order).data
        return response

class VendorOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    def get_queryset(self):
        if self.request.user.role != "vendor" or not hasattr(self.request.user, "vendor_store"):
            raise PermissionDenied("Vendor store access required.")
        return Order.objects.filter(items__vendor=self.request.user.vendor_store).distinct().prefetch_related("items__vendor").order_by("-created_at")

class VendorOrderStatusView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    http_method_names = ["patch"]

    def get_queryset(self):
        if self.request.user.role != "vendor" or not hasattr(self.request.user, "vendor_store"):
            raise PermissionDenied("Vendor store access required.")
        return Order.objects.filter(items__vendor=self.request.user.vendor_store).distinct()

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        requested = request.data.get("status")
        transitions = {
            Order.Status.PENDING: {Order.Status.CONFIRMED, Order.Status.CANCELLED},
            Order.Status.CONFIRMED: {Order.Status.PREPARING, Order.Status.CANCELLED},
            Order.Status.PREPARING: {Order.Status.READY},
        }
        if requested not in transitions.get(order.status, set()):
            from rest_framework.response import Response
            from rest_framework import status
            return Response({"detail": f"Cannot change {order.status} to {requested}."}, status=status.HTTP_400_BAD_REQUEST)
        order.status = requested
        order.save(update_fields=["status"])
        return __import__("rest_framework.response", fromlist=["Response"]).Response(OrderSerializer(order).data)
