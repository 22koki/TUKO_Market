from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id","name","slug")

class ProductSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source="vendor.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = (
            "id","vendor","vendor_name","category","category_name","name","description",
            "unit","price","stock_quantity","image_url","is_active","updated_at",
        )
        read_only_fields = ("id","vendor","vendor_name","category_name","updated_at")
