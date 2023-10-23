from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet

from ..models import OTP, work_exp
from .serializers import UserSerializer, OTPSerializer, work_exp_Serializer
from backend.settings import EMAIL_HOST_USER

from datetime import datetime


class userviewset(ModelViewSet):
    queryset=User.objects.all()
    serializer_class=UserSerializer

class work_exp_viewset(ModelViewSet):
    queryset=work_exp.objects.all()
    serializer_class=work_exp_Serializer

@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        email = request.data['email']
        password = request.data['password']

        if email and password:
            username = User.objects.get(email=email).username
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'message': 'Email and password not found / provided.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def check_authentication(request):
    print(request.user)
    if request.user.is_authenticated:
        return Response({'authenticated': True}, status=status.HTTP_200_OK)
    return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def send_otp(request):
    if request.method == 'POST':
        email = request.data['email']
        if email:
            try:
                otp_instance = OTP.objects.get(email=email)
                otp_instance.delete()
            except OTP.DoesNotExist:
                pass
            
            otp = get_random_string(length=6, allowed_chars='1234567890')
            otp_instance, created = OTP.objects.get_or_create(email=email, otp=otp)
            otp_instance.save()

            send_mail(
                'OTP for registration',
                f'Your OTP is {otp}',
                EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        return Response({'message': 'Email not found / provided.'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def verify_otp(request):
    if request.method == 'POST':
        email = request.data['email']
        otp = request.data['otp']

        if email and otp:
            try:
                otp_instance = OTP.objects.get(email=email)
                stored_otp = otp_instance.otp

                if otp == stored_otp:
                    otp_instance.delete()
                    return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

            except OTP.DoesNotExist:
                return Response({'message': 'Email not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'message': 'OTP verification failed'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        email = request.data['email']
        password = request.data['password']

        if email and password:
            try:
                validate_password(password, user=User)
                username = f"{datetime.now().strftime('%Y%m%d%H%M%S')}"
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({'error': e}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': 'Email and password not found / provided.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            username = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{email}"
            
            user = User(email=email, password=password, username=username)
            user.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def addwork_exp(request):
    if request.method == 'POST':
        serializer = work_exp_Serializer(data=request.data)
        if serializer.is_valid():
            work = work_exp(
                title=serializer.validated_data['title'],
                company=serializer.validated_data['company'],
                location=serializer.validated_data['location'],
                location_type=serializer.validated_data['location_type'],
                currently_working=serializer.validated_data['currently_working'],
            )
            work.save()
            return Response({'message': 'Work Added successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
