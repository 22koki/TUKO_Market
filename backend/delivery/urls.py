from django.urls import path
from .views import AvailableDeliveryListView, MyDeliveryListView, AcceptDeliveryView, UpdateDeliveryStatusView, CreateReadyDeliveryJobsView

urlpatterns = [
    path("available/", AvailableDeliveryListView.as_view(), name="delivery-available"),
    path("mine/", MyDeliveryListView.as_view(), name="delivery-mine"),
    path("<int:pk>/accept/", AcceptDeliveryView.as_view(), name="delivery-accept"),
    path("<int:pk>/update/", UpdateDeliveryStatusView.as_view(), name="delivery-update"),
    path("sync-ready/", CreateReadyDeliveryJobsView.as_view(), name="delivery-sync-ready"),
]
