from django.urls import path
from .views import OrderListCreateView, VendorOrderListView, VendorOrderStatusView
urlpatterns = [
    path("", OrderListCreateView.as_view(), name="order-list-create"),
    path("vendor/", VendorOrderListView.as_view(), name="vendor-order-list"),
    path("vendor/<int:pk>/status/", VendorOrderStatusView.as_view(), name="vendor-order-status"),
]
