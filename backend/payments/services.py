import base64
import re
import uuid
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP

import requests
from django.conf import settings


def normalize_ke_phone(phone_number):
    digits = re.sub(r"\D", "", str(phone_number))
    if digits.startswith("0") and len(digits) == 10:
        digits = "254" + digits[1:]
    elif digits.startswith("7") and len(digits) == 9:
        digits = "254" + digits
    elif digits.startswith("1") and len(digits) == 9:
        digits = "254" + digits
    if not re.fullmatch(r"254(?:7|1)\d{8}", digits):
        raise ValueError("Enter a valid Kenyan M-PESA number, e.g. 0712345678.")
    return digits


class MpesaClient:
    def __init__(self):
        self.mock = settings.MPESA_MOCK
        self.base_url = settings.MPESA_BASE_URL.rstrip("/")

    def _access_token(self):
        if not settings.MPESA_CONSUMER_KEY or not settings.MPESA_CONSUMER_SECRET:
            raise RuntimeError("M-PESA consumer key/secret are not configured.")
        response = requests.get(
            self.base_url + "/oauth/v1/generate",
            params={"grant_type": "client_credentials"},
            auth=(settings.MPESA_CONSUMER_KEY, settings.MPESA_CONSUMER_SECRET),
            timeout=20,
        )
        response.raise_for_status()
        token = response.json().get("access_token")
        if not token:
            raise RuntimeError("Safaricom OAuth response did not include an access token.")
        return token

    def initiate_stk_push(self, *, phone_number, amount, order_id):
        phone = normalize_ke_phone(phone_number)

        if self.mock:
            token = uuid.uuid4().hex
            return {
                "merchant_request_id": "MOCK-" + token[:12],
                "checkout_request_id": "MOCK-CHECKOUT-" + token,
                "response_description": "Mock STK push accepted",
                "customer_message": "Mock STK request accepted.",
                "phone_number": phone,
            }

        required = {
            "MPESA_SHORTCODE": settings.MPESA_SHORTCODE,
            "MPESA_PASSKEY": settings.MPESA_PASSKEY,
            "MPESA_CALLBACK_URL": settings.MPESA_CALLBACK_URL,
        }
        missing = [name for name, value in required.items() if not value]
        if missing:
            raise RuntimeError("Missing M-PESA configuration: " + ", ".join(missing))

        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        raw_password = f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}"
        password = base64.b64encode(raw_password.encode()).decode()
        whole_amount = int(
            Decimal(str(amount)).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        )

        payload = {
            "BusinessShortCode": settings.MPESA_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": settings.MPESA_TRANSACTION_TYPE,
            "Amount": whole_amount,
            "PartyA": phone,
            "PartyB": settings.MPESA_SHORTCODE,
            "PhoneNumber": phone,
            "CallBackURL": settings.MPESA_CALLBACK_URL,
            "AccountReference": f"TUKO-{order_id}",
            "TransactionDesc": f"TUKO order {order_id}",
        }

        response = requests.post(
            self.base_url + "/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={"Authorization": "Bearer " + self._access_token()},
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()

        if str(data.get("ResponseCode", "")) != "0":
            raise RuntimeError(
                data.get("errorMessage")
                or data.get("ResponseDescription")
                or "Safaricom rejected the STK request."
            )

        return {
            "merchant_request_id": data.get("MerchantRequestID", ""),
            "checkout_request_id": data.get("CheckoutRequestID", ""),
            "response_description": data.get("ResponseDescription", ""),
            "customer_message": data.get("CustomerMessage", ""),
            "phone_number": phone,
        }


def parse_stk_callback(payload):
    callback = (payload.get("Body") or {}).get("stkCallback") or {}
    metadata = {}
    for item in ((callback.get("CallbackMetadata") or {}).get("Item") or []):
        name = item.get("Name")
        if name:
            metadata[name] = item.get("Value")

    return {
        "merchant_request_id": callback.get("MerchantRequestID", ""),
        "checkout_request_id": callback.get("CheckoutRequestID", ""),
        "result_code": str(callback.get("ResultCode", "")),
        "result_description": callback.get("ResultDesc", ""),
        "mpesa_receipt_number": str(metadata.get("MpesaReceiptNumber", "")),
        "amount": metadata.get("Amount"),
        "phone_number": str(metadata.get("PhoneNumber", "")),
        "transaction_date": metadata.get("TransactionDate"),
    }
