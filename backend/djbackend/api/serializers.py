from rest_framework.serializers import ModelSerializer
from ..models import OTP, work_exp
from django.contrib.auth.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model=User
        fields=('email','password')


class OTPSerializer(ModelSerializer):
    class Meta:
        model=OTP
        fields=('email','otp','created_at')


class work_exp_Serializer(ModelSerializer):
    class Meta:
        model=work_exp
        fields=('title','company','location','location_type','currently_working','start_time','end_time')
