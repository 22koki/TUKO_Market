import secrets
from decimal import Decimal
from django.conf import settings
from django.db import models
from orders.models import Order

class DeliveryJob(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        ACCEPTED = "accepted", "Accepted"
        PICKED_UP = "picked_up", "Picked up"
        OUT_FOR_DELIVERY = "out_for_delivery", "Out for delivery"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="delivery_job")
    rider = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="delivery_jobs")
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.AVAILABLE)
    earnings = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("150.00"))
    delivery_pin = models.CharField(max_length=4)
    accepted_at = models.DateTimeField(null=True, blank=True)
    picked_up_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.delivery_pin:
            self.delivery_pin = f"{secrets.randbelow(10000):04d}"
        super().save(*args, **kwargs)
