from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from vendors.models import VendorStore
from catalog.models import Category, Product
from .models import Order

User = get_user_model()

class OrderTests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(username="buyer", password="StrongPass123!", role="customer")
        vendor_user = User.objects.create_user(username="seller", password="StrongPass123!", role="vendor")
        store = VendorStore.objects.create(owner=vendor_user, name="Mama Market", phone_number="0700000000", location_text="Nairobi", is_verified=True)
        category = Category.objects.create(name="Vegetables", slug="vegetables")
        self.product = Product.objects.create(vendor=store, category=category, name="Tomatoes", unit="kg", price="120.00", stock_quantity="10.00")
        self.client.force_authenticate(self.customer)

    def test_customer_can_place_delivery_order(self):
        response = self.client.post(reverse("order-list-create"), {
            "fulfilment": "delivery",
            "delivery_address": "Kilimani, Nairobi",
            "items": [{"product": self.product.id, "quantity": "2.00"}],
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["total"], "390.00")
        self.assertEqual(Order.objects.count(), 1)
        self.product.refresh_from_db()
        self.assertEqual(str(self.product.stock_quantity), "8.00")

    def test_delivery_requires_address(self):
        response = self.client.post(reverse("order-list-create"), {
            "fulfilment": "delivery",
            "items": [{"product": self.product.id, "quantity": "1.00"}],
        }, format="json")
        self.assertEqual(response.status_code, 400)

    def test_vendor_can_see_orders_containing_their_items(self):
        self.client.post(reverse("order-list-create"), {
            "fulfilment": "pickup",
            "items": [{"product": self.product.id, "quantity": "1.00"}],
        }, format="json")
        vendor_user = self.product.vendor.owner
        self.client.force_authenticate(vendor_user)
        response = self.client.get(reverse("vendor-order-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
