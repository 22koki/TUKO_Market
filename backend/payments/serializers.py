from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id","order","method","status","phone_number","amount","merchant_request_id","checkout_request_id","mpesa_receipt_number","result_code","result_description","created_at","updated_at")
        read_only_fields = fields

class InitiateMpesaSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    phone_number = serializers.CharField(max_length=20)
