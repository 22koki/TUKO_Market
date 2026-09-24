from django.urls import path
from .views import OrderListCreateView, VendorOrderListView, VendorOrderStatusView, CustomerOrderDetailView
urlpatterns = [
    path("", OrderListCreateView.as_view(), name="order-list-create"),
    path("vendor/", VendorOrderListView.as_view(), name="vendor-order-list"),
    path("vendor/<int:pk>/status/", VendorOrderStatusView.as_view(), name="vendor-order-status"),
    path("<int:pk>/", CustomerOrderDetailView.as_view(), name="customer-order-detail"),
]
