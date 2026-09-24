from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name","vendor","category","price","stock_quantity","is_active")
    list_filter = ("category","is_active","unit")
    search_fields = ("name","vendor__name")
