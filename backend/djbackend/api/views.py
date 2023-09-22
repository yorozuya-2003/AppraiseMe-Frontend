from rest_framework.viewsets import ModelViewSet
from ..models import work_exp
from .serializers import userSerializer, work_exp_Serializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from .serializers import userSerializer,work_exp_Serializer
from datetime import datetime


class userviewset(ModelViewSet):
    queryset=User.objects.all()
    serializer_class=userSerializer

class work_exp_viewset(ModelViewSet):
    queryset=work_exp.objects.all()
    serializer_class=work_exp_Serializer


@api_view(['POST'])
def create_user(request):
    if request.method == 'POST':
        serializer = userSerializer(data=request.data)
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
