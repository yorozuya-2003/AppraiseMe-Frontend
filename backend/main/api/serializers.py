from rest_framework.serializers import ModelSerializer
from ..models import OTP,Profiles, work_exp
from django.contrib.auth.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model=User
        fields=('email','password')


class OTPSerializer(ModelSerializer):
    class Meta:
        model=OTP
        fields=('email','otp','created_at')


class ProfileSerializer(ModelSerializer):
    class Meta:
        model=Profiles
        fields=('First_name','Second_name','DOB','Gender','Pronouns','Email')

class work_exp_Serializer(ModelSerializer):
    class Meta:
        model=work_exp
        fields=('email','title','company','location','location_type','emp_type','currently_working','start_time','end_time')


