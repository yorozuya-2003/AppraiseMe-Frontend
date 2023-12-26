from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from ..models import Profile, WorkExperience, Review


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = ('first_name', 'second_name', 'dob',
                  'gender', 'pronouns', 'email', 'image', 'bio')


class WorkExperienceSerializer(ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = ('email', 'title', 'company', 'location', 'location_type',
                  'emp_type', 'currently_working', 'start_time', 'end_time')


class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'to_user',
            'from_user',
            'acquaintance',
            'acquaintance_time',
            'relation',
            'team_size',
            'slider1',
            'slider2',
            'slider3',
            'slider4',
            'slider5',
            'slider6',
            'slider7',
            'slider8',
            'slider9',
            'sentence',
            'is_anonymous',
        ]
