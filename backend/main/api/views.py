from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet

from ..models import OTP, Profiles, work_exp
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
                username = f"{datetime.now().strftime('%Y%m%d%H%M%S')}"
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                data = {'username': username, 'email': email}
                return Response(data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
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
    
    def create(self, request, *args, **kwargs):
        target_email = request.data.get('Email')
        existing_profile = Profiles.objects.filter(Email=target_email).first()

        if existing_profile:
            existing_profile.delete()
        return super().create(request, *args, **kwargs)


class work_exp_viewset(ModelViewSet):
    queryset=work_exp.objects.all()
    serializer_class=work_exp_Serializer

    def get_queryset(self):
        target_email = self.request.query_params.get('email')
        return work_exp.objects.filter(email=target_email)
        
    def delete(self, request, *args, **kwargs):
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
        else:
            print(serializer.errors)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def get_review(self, request):
        to_user = self.request.query_params.get('to_user')
        from_user = self.request.query_params.get('from_user')
        review = Review.objects.filter(to_user=to_user, from_user=from_user).first()
        serializer = ReviewSerializer(review)
        data = dict(serializer.data)
        data['id'] = review.id
        return Response(data)


@api_view(['GET'])
def get_reviews_for_user(request, to_user_email):
    try:
        current_user_email = request.GET.get('email')
        to_user_profile = Profiles.objects.get(Email=to_user_email)
        reviews = Review.objects.filter(to_user=to_user_email)
        current_user_review = Review.objects.filter(from_user=current_user_email, to_user=to_user_email).first()
        current_user_profile = Profiles.objects.get(Email=current_user_email)
        current_user_id = User.objects.get(email=current_user_email).username
        current_user_name = current_user_profile.First_name + " " + current_user_profile.Second_name
        if current_user_review is not None:
            if current_user_review.is_anonymous:
                current_user_name += " (Anonymous)"

        review_list = []

        if current_user_review is not None:
            review_list.append({
                "user_id": current_user_id,
                "id": current_user_review.id,
                "from_user": current_user_review.from_user,
                "from_user_name": current_user_name,
                "acquaintance": current_user_review.acquaintance,
                "acquaintance_time": current_user_review.acquaintance_time,
                "relation": current_user_review.relation,
                "team_size": current_user_review.team_size,
                "slider1": current_user_review.slider1,
                "slider2": current_user_review.slider2,
                "slider3": current_user_review.slider3,
                "slider4": current_user_review.slider4,
                "slider5": current_user_review.slider5,
                "slider6": current_user_review.slider6,
                "slider7": current_user_review.slider7,
                "slider8": current_user_review.slider8,
                "slider9": current_user_review.slider9,
                "sentence": current_user_review.sentence,
                "is_anonymous": current_user_review.is_anonymous,
                "upvotes_count": current_user_review.get_upvotes_count(),
                "downvotes_count": current_user_review.get_downvotes_count(),
                "has_upvoted": current_user_review.has_upvoted(current_user_email),
                "has_downvoted": current_user_review.has_downvoted(current_user_email),
                "can_delete": True,
            })

        for review in reviews:
            if review.from_user == current_user_email:
                continue
            review_dict = {
                "user_id": User.objects.get(email=review.from_user).username,
                "id": review.id,
                "from_user": review.from_user,
                "from_user_name": review.review_giver(),
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
                "is_anonymous": review.is_anonymous,
                "upvotes_count": review.get_upvotes_count(),
                "downvotes_count": review.get_downvotes_count(),
                "has_upvoted": review.has_upvoted(current_user_email),
                "has_downvoted": review.has_downvoted(current_user_email),
                "can_delete": False,
            }
            review_list.append(review_dict)

        return JsonResponse({"reviews": review_list})

    except Profiles.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

@api_view(['GET'])
def get_reviews_of_user(request, user_email):
    try:
        reviews = Review.objects.filter(from_user=user_email)
        profile_data = []
        for review in reviews:
            to_user_email = review.to_user
            profile = get_object_or_404(Profiles, Email=to_user_email)
            user = User.objects.get(email=profile.Email)
            review_dict={
                'sentence': review.sentence,
                'username': user.username,
                'First_name': profile.First_name,
                'Second_name': profile.Second_name,
            }
            profile_data.append(review_dict)
        return JsonResponse({'reviews': profile_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

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
                'img': str(profile.Image),
            })
        except User.DoesNotExist:
            pass

    return JsonResponse(suggestions, safe=False)


@api_view(['POST'])
def update_bio(request, email):
    if request.method == 'POST':
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

@api_view(['POST'])
def upvote_review(request, review_id):
    if request.method == 'POST':
        user_email = request.data.get('email')
        try:
            review = Review.objects.get(id=review_id)
            review.upvote(user_email)
            review.save()
            return JsonResponse({'success': True, 'upvotes_count': review.get_upvotes_count(), 'downvotes_count': review.get_downvotes_count(),
                'has_upvoted': review.has_upvoted(user_email), 'has_downvoted': review.has_downvoted(user_email)})
        except Review.DoesNotExist:
            return JsonResponse({'error': 'Review not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

@api_view(['POST'])
def downvote_review(request, review_id):
    if request.method == 'POST':
        user_email = request.data.get('email')
        try:
            review = Review.objects.get(id=review_id)
            review.downvote(user_email)
            review.save()
            return JsonResponse({'success': True, 'upvotes_count': review.get_upvotes_count(), 'downvotes_count': review.get_downvotes_count(),
                'has_upvoted': review.has_upvoted(user_email), 'has_downvoted': review.has_downvoted(user_email)})
        except Review.DoesNotExist:
            return JsonResponse({'error': 'Review not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@api_view(['DELETE'])
def delete_review(request, review_id):
    if request.method == 'DELETE':
        try:
            review = Review.objects.get(id=review_id)
            review.delete()
            return JsonResponse({'success': True})
        except Review.DoesNotExist:
            return JsonResponse({'error': 'Review not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@api_view(['PUT'])
def edit_review(request, review_id):
    review = Review.objects.get(id=review_id)
    serializer = ReviewSerializer(review, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'message': 'Review updated successfully.'}, status=status.HTTP_200_OK)
    else:
        print(serializer.errors)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def has_reviewed(request, to_user_email):
    try:
        current_user_email = request.GET.get('email')
        current_user_review = Review.objects.filter(from_user=current_user_email, to_user=to_user_email).first()
        has_reviewed = False
        if current_user_review:
            has_reviewed = True
        return JsonResponse({'has_reviewed': has_reviewed})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
