from rest_framework import serializers
from .models import VendorStore

class VendorStoreSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = VendorStore
        fields = (
            "id","owner_username","name","description","phone_number","market_name",
            "location_text","latitude","longitude","is_verified","is_open",
            "settlement_type","settlement_number","settlement_account","created_at",
        )
        read_only_fields = ("id","owner_username","is_verified","created_at")
