from django.contrib import admin
from django.urls import path, include
from djbackend.api.views import user_login, send_otp, verify_otp, register_user, addwork_exp

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.api.urls')),

    path('add_work/', addwork_exp, name='add_work'),

    path('send_otp/', send_otp, name='send_otp'),
    path('verify_otp/', verify_otp, name='verify_otp'),
    path('register_user/', register_user, name='register_user'),
    path('user_login/', user_login, name='user_login'),
]
