from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import VendorStore
from .permissions import IsVendor
from .serializers import VendorStoreSerializer

class PublicVendorListView(generics.ListAPIView):
    serializer_class = VendorStoreSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return VendorStore.objects.filter(is_verified=True, is_open=True).order_by("name")

class MyVendorStoreView(generics.RetrieveUpdateAPIView):
    serializer_class = VendorStoreSerializer
    permission_classes = [IsVendor]

    def get_object(self):
        try:
            return self.request.user.vendor_store
        except VendorStore.DoesNotExist:
            raise PermissionDenied("Create your vendor store first.")

class CreateVendorStoreView(generics.CreateAPIView):
    serializer_class = VendorStoreSerializer
    permission_classes = [IsVendor]

    def perform_create(self, serializer):
        if hasattr(self.request.user, "vendor_store"):
            raise PermissionDenied("This vendor already has a store.")
        serializer.save(owner=self.request.user)
