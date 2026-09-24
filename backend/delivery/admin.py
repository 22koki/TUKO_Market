from django.contrib import admin
from .models import DeliveryJob

@admin.register(DeliveryJob)
class DeliveryJobAdmin(admin.ModelAdmin):
    list_display = ("id","order","rider","status","earnings","created_at")
    list_filter = ("status",)
