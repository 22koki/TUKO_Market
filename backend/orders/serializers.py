from decimal import Decimal
from django.db import transaction
from rest_framework import serializers
from catalog.models import Product
from .models import Order, OrderItem

class OrderItemInputSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True))
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal("0.01"))

class OrderItemSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source="vendor.name", read_only=True)
    class Meta:
        model = OrderItem
        fields = ("id","product","product_name","vendor","vendor_name","unit","unit_price","quantity","line_total")

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    delivery = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ("id","fulfilment","status","delivery_address","customer_note","items_total","delivery_fee","total","created_at","items","delivery")

    def get_delivery(self, obj):
        if not hasattr(obj, "delivery_job"):
            return None
        from delivery.serializers import CustomerDeliveryJobSerializer
        return CustomerDeliveryJobSerializer(obj.delivery_job).data

class CreateOrderSerializer(serializers.Serializer):
    fulfilment = serializers.ChoiceField(choices=Order.Fulfilment.choices)
    delivery_address = serializers.CharField(required=False, allow_blank=True)
    customer_note = serializers.CharField(required=False, allow_blank=True)
    items = OrderItemInputSerializer(many=True)

    def validate(self, attrs):
        if not attrs["items"]:
            raise serializers.ValidationError({"items": "Your basket is empty."})
        if attrs["fulfilment"] == Order.Fulfilment.DELIVERY and not attrs.get("delivery_address"):
            raise serializers.ValidationError({"delivery_address": "Delivery address is required."})
        for row in attrs["items"]:
            if row["quantity"] > row["product"].stock_quantity:
                raise serializers.ValidationError({"items": f"Not enough stock for {row['product'].name}."})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items")
        customer = self.context["request"].user
        items_total = sum((row["product"].price * row["quantity"] for row in items), Decimal("0.00"))
        delivery_fee = Decimal("150.00") if validated_data["fulfilment"] == Order.Fulfilment.DELIVERY else Decimal("0.00")
        order = Order.objects.create(customer=customer, items_total=items_total, delivery_fee=delivery_fee, total=items_total + delivery_fee, **validated_data)
        for row in items:
            product = Product.objects.select_for_update().get(pk=row["product"].pk)
            if row["quantity"] > product.stock_quantity:
                raise serializers.ValidationError({"items": f"Not enough stock for {product.name}."})
            OrderItem.objects.create(order=order, vendor=product.vendor, product=product, product_name=product.name, unit=product.unit, unit_price=product.price, quantity=row["quantity"], line_total=product.price * row["quantity"])
            product.stock_quantity -= row["quantity"]
            product.save(update_fields=["stock_quantity"])
        return order
