from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.db.models import Q
from django.http import HttpResponse

from rest_framework.decorators import api_view, action
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
        
    def delete(self, request, *args, **kwargs):
        print(request.data)
        print("hi")
        try:
            target_email = request.data.get('email')
            title_to_delete = request.data.get('title')
            emp_type_to_delete = request.data.get('emp_type')
            company_to_delete = request.data.get('company')
            location_to_delete = request.data.get('location')
            location_type_to_delete = request.data.get('location_type')
            currently_working_to_delete = request.data.get('currently_working')
            start_time_to_delete = request.data.get('start_time')
            end_time_to_delete = request.data.get('end_time')

            item_to_delete = work_exp.objects.filter(
                email=target_email,
                title=title_to_delete,
                emp_type=emp_type_to_delete,
                company=company_to_delete,
                location=location_to_delete,
                location_type=location_type_to_delete,
                currently_working=currently_working_to_delete,
                start_time=start_time_to_delete,
                end_time=end_time_to_delete
            ).first()

            if item_to_delete:
                self.perform_destroy(item_to_delete)
                return Response("Item deleted successfully", status=200)
            else:
                return Response("Item not found", status=404)
        except work_exp.DoesNotExist:
            return Response("Item not found", status=404)


    def create(self, request, *args, **kwargs):
        serializer = work_exp_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Experience added successfully.'}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



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


@api_view(['GET'])
def get_profile(request, email):
    try:
        profile = Profiles.objects.get(Email=email)
        serializer = ProfileSerializer(profile)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    except Profiles.DoesNotExist:
        return JsonResponse({'message': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def check_profile_completion(request, email):
    try:
        profile = Profiles.objects.get(Email=email)
        serializer = ProfileSerializer(profile)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    except Profiles.DoesNotExist:
        return JsonResponse({'Email': None}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def search_suggestions(request):
    query = request.GET.get('q', '')
    profiles = Profiles.objects.filter(Q(First_name__icontains=query) | Q(Second_name__icontains=query))
    suggestions = []

    for profile in profiles:
        try:
            user = User.objects.get(email=profile.Email)
            suggestions.append({
                'first_name': profile.First_name,
                'last_name': profile.Second_name,
                'username': user.username,
            })
        except User.DoesNotExist:
            pass

    return JsonResponse(suggestions, safe=False)


@api_view(['POST'])
def update_bio(request, email):
    if request.method == 'POST':
        print(request.data)
        # user_email = request.data.get('email')
        new_bio = request.data.get('bio')

        try:
            profile = Profiles.objects.get(Email=email)
            profile.Bio = new_bio
            profile.save()
            return Response({'message': 'Bio updated successfully'}, status=status.HTTP_200_OK)
        except Profiles.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'error': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_image(request, email):
    if request.method == 'POST':
        new_img = request.data.get('image')

        try:
            profile = Profiles.objects.get(Email=email)
            profile.Image = new_img
            profile.save()
            return Response({'message': 'Image updated successfully'}, status=status.HTTP_200_OK)
        except Profiles.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'error': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)