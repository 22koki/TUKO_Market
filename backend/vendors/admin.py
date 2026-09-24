from django.contrib import admin
from .models import VendorStore

@admin.register(VendorStore)
class VendorStoreAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "market_name", "is_verified", "is_open")
    list_filter = ("is_verified", "is_open", "settlement_type")
    search_fields = ("name", "owner__username", "market_name", "location_text")
