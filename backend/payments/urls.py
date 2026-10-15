from django.urls import path
from .views import InitiateMpesaView, MpesaCallbackView, PaymentDetailView
urlpatterns = [
    path("mpesa/initiate/", InitiateMpesaView.as_view(), name="mpesa-initiate"),
    path("mpesa/callback/", MpesaCallbackView.as_view(), name="mpesa-callback"),
    path("mpesa/callback/<str:callback_token>/", MpesaCallbackView.as_view(), name="mpesa-callback-secure"),
    path("orders/<int:order_id>/", PaymentDetailView.as_view(), name="payment-detail"),
]
