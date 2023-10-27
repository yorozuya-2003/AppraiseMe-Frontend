from django.db import models
from datetime import datetime

class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.email}'

class Profiles(models.Model):
    Pronouns_choice = (
        ('His/Him', 'His/Him'),
        ('Her/She', 'Her/She'),
        ('They/Their','They/Their'),
        ('other','other'),
    )
    Gender_choice=(
        ('Male','Male'),        
        ('Female','Female'),        
        ('Other','Other'),        
    )

    Email=models.EmailField(max_length=30,default='vv@gmail.com')
    First_name=models.CharField(max_length=30)
    Second_name=models.CharField(max_length=30)
    DOB=models.DateField()
    Gender=models.CharField(max_length=20,choices=Gender_choice)
    Pronouns=models.CharField(max_length=20,choices=Pronouns_choice)

    def __str__(self):
        return f'{self.Email}'


class work_exp(models.Model):
    emp_type_choice = (
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
    )
    loc_type_choice=(
        ('Onsite','Onsite'),        
        ('Hybrid','Hybrid'),        
        ('Remote','Remote'),        
    )
    email=models.EmailField(max_length=40)
    title=models.CharField(max_length=20)
    emp_type=models.CharField(max_length=10,choices=emp_type_choice)
    company=models.CharField(max_length=30)
    location=models.CharField(max_length=30)
    location_type=models.CharField(max_length=30,choices=loc_type_choice)
    currently_working=models.BooleanField(default=1)
    start_time=models.DateField()
    end_time=models.DateField()
