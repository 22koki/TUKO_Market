from django.db import models
from vendors.models import VendorStore

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ("name",)

    def __str__(self):
        return self.name

class Product(models.Model):
    class Unit(models.TextChoices):
        ITEM = "item", "Item"
        KG = "kg", "Kilogram"
        GRAM = "g", "Gram"
        LITRE = "l", "Litre"
        PACK = "pack", "Pack"
        BUNCH = "bunch", "Bunch"
        TRAY = "tray", "Tray"

    vendor = models.ForeignKey(VendorStore, on_delete=models.CASCADE, related_name="products")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    unit = models.CharField(max_length=20, choices=Unit.choices, default=Unit.ITEM)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    image_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)
        constraints = [
            models.UniqueConstraint(fields=("vendor","name","unit"), name="unique_vendor_product_unit")
        ]

    def __str__(self):
        return f"{self.name} - {self.vendor.name}"
