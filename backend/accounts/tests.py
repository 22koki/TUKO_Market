from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class AccountApiTests(APITestCase):
    def test_customer_can_register_and_login(self):
        payload = {
            "username": "customer1",
            "email": "customer@example.com",
            "phone_number": "0712345678",
            "role": "customer",
            "password": "StrongPass123!",
        }
        response = self.client.post(reverse("register"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        login = self.client.post(
            reverse("token_obtain_pair"),
            {"username": payload["username"], "password": payload["password"]},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.assertIn("access", login.data)
        self.assertIn("refresh", login.data)

    def test_admin_cannot_self_register(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "fakeadmin",
                "role": "admin",
                "password": "StrongPass123!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
