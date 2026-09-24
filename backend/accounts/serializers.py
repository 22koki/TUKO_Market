from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "username", "email", "phone_number", "role", "password")
        read_only_fields = ("id",)

    def validate_role(self, value):
        if value == User.Role.ADMIN:
            raise serializers.ValidationError("Admin accounts cannot be self-registered.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "is_phone_verified",
        )
        read_only_fields = ("id", "role", "is_phone_verified")
