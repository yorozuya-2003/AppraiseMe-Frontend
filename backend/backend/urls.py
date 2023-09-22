from django.contrib import admin
from django.urls import path, include
from djbackend.api.views import create_user,addwork_exp  # Adjust the import

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.api.urls')),
    path('create_user/', create_user, name='create_user'),  # Use the imported view
    path('add_work/', addwork_exp, name='add_work'),  # Use the imported view
]
