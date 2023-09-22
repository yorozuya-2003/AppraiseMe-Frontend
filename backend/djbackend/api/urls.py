from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import userviewset, work_exp_viewset

user_router=DefaultRouter()
user_router.register(r'user',userviewset)
user_router.register(r'addwork',work_exp_viewset)

