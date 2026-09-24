from rest_framework import serializers
from .models import DeliveryJob

class DeliveryJobSerializer(serializers.ModelSerializer):
    order_total = serializers.DecimalField(source="order.total", max_digits=12, decimal_places=2, read_only=True)
    delivery_address = serializers.CharField(source="order.delivery_address", read_only=True)
    rider_username = serializers.CharField(source="rider.username", read_only=True)

    class Meta:
        model = DeliveryJob
        fields = ("id","order","status","earnings","delivery_pin","order_total","delivery_address","rider_username","accepted_at","picked_up_at","delivered_at","created_at")
        read_only_fields = fields
