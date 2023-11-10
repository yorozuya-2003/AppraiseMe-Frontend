from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet

from ..models import OTP,Profiles,work_exp
from .serializers import *
from backend.settings import EMAIL_HOST_USER

from datetime import datetime


@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        email = request.data['email']
        password = request.data['password']

        if email and password:
            try:
                user = User.objects.get(email=email)
                username = user.username
                user = authenticate(request, username=username, password=password)
                if user is not None:
                    login(request, user)
                    data = {'username': username, 'email': email}
                    return Response(data, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({'message': 'Email is not registered'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Email and password not provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def send_otp(request):
    if request.method == 'POST':
        email = request.data['email']

        if not email:
            return Response({'message': 'Email not provided'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email)
        if user:
            return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if email:
            try:
                otp_instance = OTP.objects.get(email=email)
                otp_instance.delete()
            except OTP.DoesNotExist:
                pass
            
            otp = get_random_string(length=6, allowed_chars='1234567890')
            print(otp)
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
                # validate_password(password, user=User)
                username = f"{datetime.now().strftime('%Y%m%d%H%M%S')}"
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                serializer = UserSerializer(user)
                data = {'username': username, 'email': email}
                return Response(data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                # error_string = ''
                # for each in e:
                #     error_string += each
                #     error_string += '\n'
                return Response({'error': e}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': 'Email and password not found / provided.'}, status=status.HTTP_400_BAD_REQUEST)    


@api_view(['GET'])
def user_profile(request, username):
    try:
        user = User.objects.get(username=username)
        user_data = {
            'username': user.username,
            'email': user.email,
        }
        return Response(user_data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class Profiles_viewset(ModelViewSet):
    queryset=Profiles.objects.all()
    serializer_class=ProfileSerializer
    def get_queryset(self):
        target_email = self.request.query_params.get('Email')
        return Profiles.objects.filter(Email=target_email)

def create_user(request):
    if request.method == 'POST':
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = Profiles(
                First_name=serializer.validated_data['First_name'],
                Second_name=serializer.validated_data['Second_name'],
                DOB=serializer.validated_data['DOB'],
                Gender=serializer.validated_data['Gender'],
                Pronouns=serializer.validated_data['Pronouns'],
                Email=serializer.validated_data['Email'],
            )
            profile.save()
            return Response({'message': 'Profile Added successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class work_exp_viewset(ModelViewSet):
    queryset=work_exp.objects.all()
    serializer_class=work_exp_Serializer

    def get_queryset(self):
        target_email = self.request.query_params.get('email')
        return work_exp.objects.filter(email=target_email)

@api_view(['POST'])
def addwork_exp(request):
    if request.method == 'POST':
        serializer = work_exp_Serializer(data=request.data)
        if serializer.is_valid():
            work = work_exp(
                email=serializer.validated_data['email'],
                title=serializer.validated_data['title'],
                company=serializer.validated_data['company'],
                location=serializer.validated_data['location'],
                location_type=serializer.validated_data['location_type'],
                currently_working=serializer.validated_data['currently_working'],
                emp_type=serializer.validated_data['emp_type'],
                start_time=serializer.validated_data['start_time'],
                end_time=serializer.validated_data['end_time'],
            )
            work.save()
            return Response({'message': 'Work Added successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_queryset(self):
        target_email = self.request.query_params.get('to_user')
        return Review.objects.filter(to_user=target_email)
    
    def create(self, request, *args, **kwargs):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Review added successfully.'}, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_reviews_for_user(request, to_user_email):
    try:
        # Retrieve the Profiles instance for the to_user
        to_user_profile = Profiles.objects.get(Email=to_user_email)

        # Retrieve all reviews given to the to_user
        reviews = Review.objects.filter(to_user=to_user_email)

        # Create a list to store the review details as dictionaries
        review_list = []

        for review in reviews:
            # Retrieve the from_user's first name and last name
            from_user_profile = Profiles.objects.get(Email=review.from_user)
            from_user_first_name = from_user_profile.First_name
            from_user_last_name = from_user_profile.Second_name

            # Create a dictionary with review details
            review_dict = {
                "from_user": review.from_user,
                "from_user_first_name": from_user_first_name,
                "from_user_last_name": from_user_last_name,
                "acquaintance": review.acquaintance,
                "acquaintance_time": review.acquaintance_time,
                "relation": review.relation,
                "team_size": review.team_size,
                "slider1": review.slider1,
                "slider2": review.slider2,
                "slider3": review.slider3,
                "slider4": review.slider4,
                "slider5": review.slider5,
                "slider6": review.slider6,
                "slider7": review.slider7,
                "slider8": review.slider8,
                "slider9": review.slider9,
                "sentence": review.sentence,
            }
            review_list.append(review_dict)

        return JsonResponse({"reviews": review_list})

    except Profiles.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)