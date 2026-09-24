from django.conf import settings
from django.db import models

class VendorStore(models.Model):
    class SettlementType(models.TextChoices):
        TILL = "till", "M-PESA Till"
        PAYBILL = "paybill", "M-PESA Paybill"
        PHONE = "phone", "M-PESA Phone"

    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="vendor_store")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20)
    market_name = models.CharField(max_length=120, blank=True)
    location_text = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_open = models.BooleanField(default=True)
    settlement_type = models.CharField(max_length=20, choices=SettlementType.choices, default=SettlementType.PHONE)
    settlement_number = models.CharField(max_length=30, blank=True)
    settlement_account = models.CharField(max_length=60, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
