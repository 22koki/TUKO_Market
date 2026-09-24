from django.urls import path
from .views import CategoryListView, ProductListView, VendorProductDetailView, VendorProductListCreateView

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("products/", ProductListView.as_view(), name="product-list"),
    path("vendor/products/", VendorProductListCreateView.as_view(), name="vendor-product-list-create"),
    path("vendor/products/<int:pk>/", VendorProductDetailView.as_view(), name="vendor-product-detail"),
]
