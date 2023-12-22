from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.email}'

class Profiles(models.Model):
    Pronouns_choice = (
        ('He/Him', 'He/Him'),
        ('She/Her', 'She/Her'),
        ('They/Them','They/Them'),
        ('Other','Other'),
    )
    Gender_choice=(
        ('Male','Male'),        
        ('Female','Female'),        
        ('Other','Other'),        
    )

    Email = models.EmailField(max_length=30)
    First_name = models.CharField(max_length=30)
    Second_name = models.CharField(max_length=30)
    DOB = models.DateField()
    Gender = models.CharField(max_length=20, choices=Gender_choice)
    Pronouns = models.CharField(max_length=20, choices=Pronouns_choice)
    Image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    Bio = models.CharField(max_length=500, blank=True, null=True)

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

    is_anonymous = models.BooleanField(default=False)

    upvotes = models.ManyToManyField(User, related_name='upvoted_reviews', blank=True)
    downvotes = models.ManyToManyField(User, related_name='downvoted_reviews', blank=True)

    class Meta:
        unique_together = ('to_user', 'from_user')

    def upvote(self, user_email):
        user = User.objects.get(email=user_email)
        if user not in self.upvotes.all():
            self.upvotes.add(user)
            if user in self.downvotes.all():
                self.downvotes.remove(user)
        elif user in self.upvotes.all():
            self.upvotes.remove(user)

    def downvote(self, user_email):
        user = User.objects.get(email=user_email) 
        if user not in self.downvotes.all():
            self.downvotes.add(user)
            if user in self.upvotes.all():
                self.upvotes.remove(user)
        elif user in self.downvotes.all():
            self.downvotes.remove(user)

    def get_upvotes_count(self):
        return self.upvotes.count()

    def get_downvotes_count(self):
        return self.downvotes.count()
    
    def review_giver(self):
        if self.is_anonymous:
            return f'Anonymous'
        else:
            FromUser = Profiles.objects.get(Email=self.from_user)
            return f'{FromUser.First_name} {FromUser.Second_name}'
        
    def review_receiver(self):
        ToUser = Profiles.objects.get(Email=self.to_user)
        return f'{ToUser.First_name} {ToUser.Last_name}'
    
    def has_upvoted(self, user_email):
        upvotes = list(map(lambda x: x.id,  self.upvotes.all()))
        user = User.objects.get(email=user_email).id
        return user in upvotes
    
    def has_downvoted(self, user_email):
        downvotes = list(map(lambda x: x.id,  self.downvotes.all()))
        user = User.objects.get(email=user_email).id
        return user in downvotes

    def __str__(self):
        return f'{self.from_user} => {self.to_user}'
