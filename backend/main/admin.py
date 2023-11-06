from django.contrib import admin
from .models import OTP, Profiles, work_exp, Review

admin.site.register(OTP)
admin.site.register(work_exp)
admin.site.register(Profiles)
admin.site.register(Review)