import uuid
from django.conf import settings

class MpesaClient:
    def initiate_stk_push(self, *, phone_number, amount, order_id):
        if settings.MPESA_MOCK:
            token = uuid.uuid4().hex
            return {
                "merchant_request_id": f"MOCK-{token[:12]}",
                "checkout_request_id": f"MOCK-CHECKOUT-{token}",
                "response_description": "Mock STK push accepted",
            }
        raise RuntimeError("Live M-PESA mode is not configured yet.")
