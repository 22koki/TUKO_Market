from django.db.models.signals import post_save
from django.dispatch import receiver
from orders.models import Order
from .models import DeliveryJob

@receiver(post_save, sender=Order)
def create_delivery_job_when_ready(sender, instance, **kwargs):
    if instance.status == Order.Status.READY and instance.fulfilment == Order.Fulfilment.DELIVERY:
        DeliveryJob.objects.get_or_create(order=instance)
