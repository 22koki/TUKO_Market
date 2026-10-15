from django.contrib.auth import get_user_model
from django.test import override_settings
from django.urls import reverse
from rest_framework.test import APITestCase
from orders.models import Order
from .models import Payment

User = get_user_model()

class PaymentTests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(username="paybuyer", password="StrongPass123!", role="customer")
        self.order = Order.objects.create(customer=self.customer, fulfilment="pickup", items_total="100.00", delivery_fee="0.00", total="100.00")
        self.client.force_authenticate(self.customer)

    def test_mock_mpesa_initiation(self):
        response = self.client.post(reverse("mpesa-initiate"), {"order_id":self.order.id,"phone_number":"0712345678"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "pending")
        self.assertTrue(response.data["checkout_request_id"].startswith("MOCK-CHECKOUT-"))

    def test_callback_marks_payment_paid(self):
        payment = Payment.objects.create(order=self.order, amount="100.00", phone_number="0712345678", checkout_request_id="MOCK-CHECKOUT-123")
        self.client.force_authenticate(user=None)
        response = self.client.post(reverse("mpesa-callback"), {"checkout_request_id":"MOCK-CHECKOUT-123","result_code":0,"result_description":"Success","mpesa_receipt_number":"TUKO123"}, format="json")
        self.assertEqual(response.status_code, 200)
        payment.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.PAID)
        self.assertEqual(payment.mpesa_receipt_number, "TUKO123")

    @override_settings(MPESA_MOCK=False, MPESA_CALLBACK_TOKEN="private-callback-token")
    def test_live_callback_rejects_unsigned_public_endpoint(self):
        payment = Payment.objects.create(
            order=self.order, amount="100.00", phone_number="254712345678",
            checkout_request_id="LIVE-CHECKOUT-123"
        )
        self.client.force_authenticate(user=None)
        response = self.client.post(
            reverse("mpesa-callback"),
            {"checkout_request_id": "LIVE-CHECKOUT-123", "result_code": 0,
             "amount": 100, "phone_number": "254712345678",
             "mpesa_receipt_number": "FRAUDULENT-RECEIPT"}, format="json"
        )
        self.assertEqual(response.status_code, 404)
        payment.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.PENDING)

    @override_settings(MPESA_MOCK=False, MPESA_CALLBACK_TOKEN="private-callback-token")
    def test_live_callback_rejects_amount_mismatch(self):
        payment = Payment.objects.create(
            order=self.order, amount="100.00", phone_number="254712345678",
            checkout_request_id="LIVE-CHECKOUT-456"
        )
        self.client.force_authenticate(user=None)
        response = self.client.post(
            reverse("mpesa-callback-secure", args=["private-callback-token"]),
            {"checkout_request_id": "LIVE-CHECKOUT-456", "result_code": 0,
             "amount": 1, "phone_number": "254712345678",
             "mpesa_receipt_number": "MISMATCH-RECEIPT"}, format="json"
        )
        self.assertEqual(response.status_code, 400)
        payment.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.PENDING)
