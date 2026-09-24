from django.urls import path
from .views import CreateVendorStoreView, MyVendorStoreView, PublicVendorListView

urlpatterns = [
    path("", PublicVendorListView.as_view(), name="vendor-list"),
    path("mine/", MyVendorStoreView.as_view(), name="vendor-mine"),
    path("create/", CreateVendorStoreView.as_view(), name="vendor-create"),
]
