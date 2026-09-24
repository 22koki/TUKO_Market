from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from vendors.models import VendorStore
from .models import Category, Product

User = get_user_model()

class MarketplaceCoreTests(APITestCase):
    def setUp(self):
        self.vendor_user = User.objects.create_user(username="vendor1", password="StrongPass123!", role="vendor")
        self.customer = User.objects.create_user(username="customer1", password="StrongPass123!", role="customer")
        self.store = VendorStore.objects.create(
            owner=self.vendor_user,
            name="Fresh Basket",
            phone_number="0712345678",
            location_text="Nairobi",
            is_verified=True,
        )
        self.category = Category.objects.create(name="Vegetables", slug="vegetables")

    def test_verified_vendor_product_is_public(self):
        Product.objects.create(
            vendor=self.store,
            category=self.category,
            name="Tomatoes",
            unit="kg",
            price="120.00",
            stock_quantity="20.00",
        )
        response = self.client.get(reverse("product-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_vendor_can_create_product_for_own_store(self):
        self.client.force_authenticate(self.vendor_user)
        response = self.client.post(
            reverse("vendor-product-list-create"),
            {
                "category": self.category.id,
                "name": "Potatoes",
                "unit": "kg",
                "price": "90.00",
                "stock_quantity": "50.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["vendor"], self.store.id)

    def test_customer_cannot_create_vendor_product(self):
        self.client.force_authenticate(self.customer)
        response = self.client.post(
            reverse("vendor-product-list-create"),
            {
                "category": self.category.id,
                "name": "Onions",
                "unit": "kg",
                "price": "100.00",
                "stock_quantity": "10.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
