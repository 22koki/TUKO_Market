from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from vendors.permissions import IsVendor
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True, vendor__is_verified=True, vendor__is_open=True)
        category = self.request.query_params.get("category")
        vendor = self.request.query_params.get("vendor")
        search = self.request.query_params.get("search")
        if category:
            qs = qs.filter(category__slug=category)
        if vendor:
            qs = qs.filter(vendor_id=vendor)
        if search:
            qs = qs.filter(name__icontains=search)
        return qs.select_related("vendor","category")

class VendorProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsVendor]

    def get_queryset(self):
        if not hasattr(self.request.user, "vendor_store"):
            return Product.objects.none()
        return Product.objects.filter(vendor=self.request.user.vendor_store).select_related("vendor","category")

    def perform_create(self, serializer):
        if not hasattr(self.request.user, "vendor_store"):
            raise PermissionDenied("Create your vendor store first.")
        serializer.save(vendor=self.request.user.vendor_store)

class VendorProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsVendor]

    def get_queryset(self):
        if not hasattr(self.request.user, "vendor_store"):
            return Product.objects.none()
        return Product.objects.filter(vendor=self.request.user.vendor_store)
