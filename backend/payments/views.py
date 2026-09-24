from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from orders.models import Order
from .models import Payment
from .serializers import InitiateMpesaSerializer, PaymentSerializer
from .services import MpesaClient

class InitiateMpesaView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        serializer = InitiateMpesaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = Order.objects.filter(pk=serializer.validated_data["order_id"], customer=request.user).first()
        if not order:
            return Response({"detail":"Order not found."}, status=status.HTTP_404_NOT_FOUND)
        payment, _ = Payment.objects.get_or_create(order=order, defaults={"amount":order.total})
        if payment.status == Payment.Status.PAID:
            return Response(PaymentSerializer(payment).data)
        payment.phone_number = serializer.validated_data["phone_number"]
        result = MpesaClient().initiate_stk_push(phone_number=payment.phone_number, amount=payment.amount, order_id=order.id)
        payment.merchant_request_id = result["merchant_request_id"]
        payment.checkout_request_id = result["checkout_request_id"]
        payment.result_description = result["response_description"]
        payment.status = Payment.Status.PENDING
        payment.save()
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)

class MpesaCallbackView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    @transaction.atomic
    def post(self, request):
        payment = Payment.objects.select_for_update().filter(checkout_request_id=request.data.get("checkout_request_id")).first()
        if not payment:
            return Response({"detail":"Unknown checkout request."}, status=status.HTTP_404_NOT_FOUND)
        code = str(request.data.get("result_code", ""))
        payment.callback_payload = request.data
        payment.result_code = code
        payment.result_description = request.data.get("result_description", "")
        payment.mpesa_receipt_number = request.data.get("mpesa_receipt_number", "")
        payment.status = Payment.Status.PAID if code == "0" else Payment.Status.FAILED
        payment.save()
        return Response({"ok":True,"status":payment.status})

class PaymentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, order_id):
        payment = Payment.objects.filter(order_id=order_id, order__customer=request.user).first()
        if not payment:
            return Response({"detail":"Payment not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(PaymentSerializer(payment).data)
