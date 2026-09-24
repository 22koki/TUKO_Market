from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from .models import Payment
from .serializers import InitiateMpesaSerializer, PaymentSerializer
from .services import MpesaClient, normalize_ke_phone, parse_stk_callback


class InitiateMpesaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = InitiateMpesaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = Order.objects.filter(
            pk=serializer.validated_data["order_id"],
            customer=request.user,
        ).first()
        if not order:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            phone = normalize_ke_phone(serializer.validated_data["phone_number"])
        except ValueError as exc:
            return Response({"phone_number": [str(exc)]}, status=status.HTTP_400_BAD_REQUEST)

        payment, _ = Payment.objects.get_or_create(
            order=order,
            defaults={"amount": order.total},
        )
        if payment.status == Payment.Status.PAID:
            return Response(PaymentSerializer(payment).data)

        payment.amount = order.total
        payment.phone_number = phone

        try:
            result = MpesaClient().initiate_stk_push(
                phone_number=phone,
                amount=payment.amount,
                order_id=order.id,
            )
        except Exception as exc:
            payment.status = Payment.Status.FAILED
            payment.result_description = str(exc)[:255]
            payment.save()
            return Response(
                {"detail": "M-PESA request failed: " + str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        payment.merchant_request_id = result["merchant_request_id"]
        payment.checkout_request_id = result["checkout_request_id"]
        payment.result_description = (
            result["response_description"] or result.get("customer_message", "")
        )
        payment.status = Payment.Status.PENDING
        payment.save()
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)


class MpesaCallbackView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    @transaction.atomic
    def post(self, request):
        data = parse_stk_callback(request.data)
        payment = Payment.objects.select_for_update().filter(
            checkout_request_id=data["checkout_request_id"]
        ).first()

        if not payment:
            return Response({"ResultCode": 0, "ResultDesc": "Accepted"})

        if payment.status == Payment.Status.PAID:
            return Response({"ResultCode": 0, "ResultDesc": "Accepted"})

        payment.callback_payload = request.data
        payment.result_code = data["result_code"]
        payment.result_description = data["result_description"]
        payment.mpesa_receipt_number = data["mpesa_receipt_number"]

        if data["result_code"] == "0":
            payment.status = Payment.Status.PAID
        elif data["result_code"] == "1032":
            payment.status = Payment.Status.CANCELLED
        else:
            payment.status = Payment.Status.FAILED

        payment.save()
        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})


class PaymentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        payment = Payment.objects.filter(
            order_id=order_id,
            order__customer=request.user,
        ).first()
        if not payment:
            return Response({"detail": "Payment not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(PaymentSerializer(payment).data)
