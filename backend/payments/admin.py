from django.contrib import admin
from .models import Payment
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id","order","method","status","amount","phone_number","created_at")
    list_filter = ("method","status")
    search_fields = ("checkout_request_id","merchant_request_id","mpesa_receipt_number","phone_number")
