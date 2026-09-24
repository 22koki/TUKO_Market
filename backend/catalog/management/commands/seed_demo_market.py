from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from catalog.models import Category, Product
from vendors.models import VendorStore

User = get_user_model()

class Command(BaseCommand):
    help = "Create a small real demo catalog for local TUKO development."

    def handle(self, *args, **options):
        vendor_user, _ = User.objects.get_or_create(
            username="demo_vendor",
            defaults={"email":"vendor@tuko.local","role":"vendor","phone_number":"0700000000"},
        )
        if not vendor_user.has_usable_password():
            vendor_user.set_password("DemoVendor123!")
            vendor_user.save(update_fields=["password"])

        store, _ = VendorStore.objects.get_or_create(
            owner=vendor_user,
            defaults={
                "name":"Fresh Basket Market",
                "phone_number":"0700000000",
                "market_name":"TUKO Demo Market",
                "location_text":"Nairobi",
                "is_verified":True,
                "is_open":True,
            },
        )
        if not store.is_verified or not store.is_open:
            store.is_verified = True
            store.is_open = True
            store.save(update_fields=["is_verified","is_open"])

        categories = {}
        for name, slug in [
            ("Vegetables","vegetables"),("Fruits","fruits"),("Meat","meat"),
            ("Dairy","dairy"),("Cereals","cereals")
        ]:
            categories[slug], _ = Category.objects.get_or_create(name=name, defaults={"slug":slug})

        products = [
            ("Tomatoes","vegetables","kg","120.00","25.00"),
            ("Potatoes","vegetables","kg","90.00","50.00"),
            ("Avocados","fruits","item","50.00","30.00"),
            ("Eggs","dairy","tray","480.00","12.00"),
            ("Rice","cereals","kg","180.00","40.00"),
        ]
        for name, slug, unit, price, stock in products:
            Product.objects.update_or_create(
                vendor=store, name=name, unit=unit,
                defaults={"category":categories[slug],"price":price,"stock_quantity":stock,"is_active":True},
            )
        self.stdout.write(self.style.SUCCESS("Demo TUKO market data is ready."))
