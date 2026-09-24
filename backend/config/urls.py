from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/vendors/", include("vendors.urls")),
    path("api/marketplace/", include("catalog.urls")),
]
