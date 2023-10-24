from django.db import models
from datetime import datetime

class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.email}'


class work_exp(models.Model):
    emp_type_choice = (
        ('F', 'Full-time'),
        ('P', 'Part-time'),
    )
    loc_type_choice=(
        ('O','Onsite'),        
        ('H','Hybrid'),        
        ('R','Remote'),        
    )
    # people = models.ForeignKey(people, on_delete=models.CASCADE, default=None, null=True, blank=True)
    title=models.CharField(max_length=20)
    emp_type=models.CharField(max_length=10,default="F",choices=emp_type_choice)
    company=models.CharField(max_length=30)
    location=models.CharField(max_length=30)
    location_type=models.CharField(max_length=30,default="O",choices=loc_type_choice)
    currently_working=models.BooleanField(default=True)
    start_time=models.DateField(default=datetime.now())
    end_time=models.DateField(default=datetime.now())
