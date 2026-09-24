from django.db import models
from orders.models import Order

class Payment(models.Model):
    class Method(models.TextChoices):
        MPESA = "mpesa", "M-PESA"
        CASH = "cash", "Cash"
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    method = models.CharField(max_length=20, choices=Method.choices, default=Method.MPESA)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    phone_number = models.CharField(max_length=20, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    merchant_request_id = models.CharField(max_length=100, blank=True, db_index=True)
    checkout_request_id = models.CharField(max_length=100, blank=True, unique=True, null=True)
    mpesa_receipt_number = models.CharField(max_length=100, blank=True)
    result_code = models.CharField(max_length=20, blank=True)
    result_description = models.CharField(max_length=255, blank=True)
    callback_payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
