from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from .models import VendorStore

User = get_user_model()


class VendorPrivacyTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="privatevendor", password="StrongPass123!", role="vendor"
        )
        self.store = VendorStore.objects.create(
            owner=self.owner, name="Private Market", phone_number="0712345678",
            location_text="Nairobi", is_verified=True,
            settlement_number="254711223344", settlement_account="PRIVATE-REF",
        )

    def test_public_listing_does_not_disclose_settlement_details(self):
        response = self.client.get(reverse("vendor-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Private Market")
        for field in ("settlement_number", "settlement_account", "settlement_type",
                      "owner_username"):
            self.assertNotIn(field, response.data[0])

    def test_owner_can_access_own_settlement_preferences(self):
        self.client.force_authenticate(self.owner)
        response = self.client.get(reverse("vendor-mine"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["settlement_account"], "PRIVATE-REF")
