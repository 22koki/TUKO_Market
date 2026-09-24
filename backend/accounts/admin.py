from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class TukoUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("TUKO", {"fields": ("role", "phone_number", "is_phone_verified")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("TUKO", {"fields": ("role", "phone_number")}),
    )
