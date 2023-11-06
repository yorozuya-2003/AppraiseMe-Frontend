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


class Review(models.Model):
    to_user = models.CharField(max_length=100)
    from_user = models.CharField(max_length=100)

    AcquintanceChoices = [
        ('Work', 'Work'),
        ('Personal', 'Personal'),
        ('Other', 'Other')
    ]
    acquaintance = models.CharField(max_length=20, default='H', choices=AcquintanceChoices)

    AcquintanceTimeChoices = [
        ('Less than 1 year', 'Less than 1 year'),
        ('1 to 3 years', '1 to 3 years'),
        ('More than 3 years', 'More than 3 years')
    ]
    acquaintance_time = models.CharField(max_length=20, default='L', choices=AcquintanceTimeChoices)

    RelationChoices = [
        ('Boss', 'Boss'),
        ('Employee', 'Employee'),
        ('Colleague', 'Colleague'),
        ('Client', 'Client'),
        ('Friend', 'Friend'),
        ('Family or Relative', 'Family or Relative'),
        ('Other', 'Other')
    ]
    relation = models.CharField(max_length=20, default='B', choices=RelationChoices)

    TeamSizeChoices = [
        ('Less than 5', 'Less than 5'),
        ('5 to 20', '5 to 20'),
        ('More than 20', 'More than 20'),
        ('None', 'None')
    ]
    team_size = models.CharField(max_length=20, default='N', choices=TeamSizeChoices)

    slider1 = models.IntegerField(default=0)
    slider2 = models.IntegerField(default=0)
    slider3 = models.IntegerField(default=0)
    slider4 = models.IntegerField(default=0)
    slider5 = models.IntegerField(default=0)
    slider6 = models.IntegerField(default=0)
    slider7 = models.IntegerField(default=0)
    slider8 = models.IntegerField(default=0)
    slider9 = models.IntegerField(default=0)

    sentence = models.TextField(max_length=500, default='')

    def __str__(self):
        return f'{self.from_user} => {self.to_user}'