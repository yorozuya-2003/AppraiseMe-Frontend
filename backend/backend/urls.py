from django.contrib import admin
from django.urls import path, include
from main.api.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.api.urls')),

    # path('add_work/', addwork_exp, name='add_work'),

    path('send_otp/', send_otp, name='send_otp'),
    path('verify_otp/', verify_otp, name='verify_otp'),
    path('register_user/', register_user, name='register_user'),
    path('user_login/', user_login, name='user_login'),
    # path('create_user/', create_user, name='create_user'),
    path('user/<str:username>/', user_profile, name='user_profile'),
    # path('get-user-email/<str:username>', get_user_email, name="get_user_email")
]
