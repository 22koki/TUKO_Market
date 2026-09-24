from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product_name","vendor","unit","unit_price","quantity","line_total")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id","customer","status","fulfilment","total","created_at")
    list_filter = ("status","fulfilment")
    inlines = [OrderItemInline]
