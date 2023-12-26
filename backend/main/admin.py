from django.contrib import admin
from .models import OTP, Profile, WorkExperience, Review

admin.site.register(OTP)
admin.site.register(Profile)
admin.site.register(WorkExperience)
admin.site.register(Review)