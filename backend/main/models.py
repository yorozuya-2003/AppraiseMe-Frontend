from django.db import models
from django.contrib.auth.models import User


class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.email}'


class Profile(models.Model):
    PRONOUNS_CHOICES = (
        ('He/Him', 'He/Him'),
        ('She/Her', 'She/Her'),
        ('They/Them', 'They/Them'),
        ('Other', 'Other'),
    )
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )

    email = models.EmailField(max_length=30)
    first_name = models.CharField(max_length=30)
    second_name = models.CharField(max_length=30)
    dob = models.DateField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    pronouns = models.CharField(max_length=20, choices=PRONOUNS_CHOICES)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    bio = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f'{self.email}'


class WorkExperience(models.Model):
    EMP_TYPE_CHOICES = (
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
    )
    LOC_TYPE_CHOICES = (
        ('On-site', 'On-site'),
        ('Hybrid', 'Hybrid'),
        ('Remote', 'Remote'),
    )
    email = models.EmailField(max_length=40)
    title = models.CharField(max_length=20)
    emp_type = models.CharField(max_length=10, choices=EMP_TYPE_CHOICES)
    company = models.CharField(max_length=30)
    location = models.CharField(max_length=30)
    location_type = models.CharField(max_length=30, choices=LOC_TYPE_CHOICES)
    currently_working = models.BooleanField(default=True)
    start_time = models.DateField()
    end_time = models.DateField()


class Review(models.Model):
    to_user = models.CharField(max_length=100)
    from_user = models.CharField(max_length=100)

    ACQUAINTANCE_CHOICES = [
        ('Work', 'Work'),
        ('Personal', 'Personal'),
        ('Other', 'Other')
    ]
    acquaintance = models.CharField(
        max_length=20, default='H', choices=ACQUAINTANCE_CHOICES
    )

    ACQUAINTANCE_TIME_CHOICES = [
        ('Less than 1 year', 'Less than 1 year'),
        ('1 to 3 years', '1 to 3 years'),
        ('More than 3 years', 'More than 3 years')
    ]
    acquaintance_time = models.CharField(
        max_length=20, default='L', choices=ACQUAINTANCE_TIME_CHOICES
    )

    RELATION_CHOICES = [
        ('Boss', 'Boss'),
        ('Employee', 'Employee'),
        ('Colleague', 'Colleague'),
        ('Client', 'Client'),
        ('Friend', 'Friend'),
        ('Family or Relative', 'Family or Relative'),
        ('Other', 'Other')
    ]
    relation = models.CharField(
        max_length=20, default='B', choices=RELATION_CHOICES)

    TEAM_SIZE_CHOICES = [
        ('Less than 5', 'Less than 5'),
        ('5 to 20', '5 to 20'),
        ('More than 20', 'More than 20'),
        ('None', 'None')
    ]
    team_size = models.CharField(
        max_length=20, default='N', choices=TEAM_SIZE_CHOICES)

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

    upvotes = models.ManyToManyField(
        User, related_name='upvoted_reviews', blank=True)
    downvotes = models.ManyToManyField(
        User, related_name='downvoted_reviews', blank=True)

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
            return 'Anonymous'
        else:
            from_user_profile = Profile.objects.get(email=self.from_user)
            return f'{from_user_profile.first_name} {from_user_profile.second_name}'

    def review_receiver(self):
        to_user_profile = Profile.objects.get(email=self.to_user)
        return f'{to_user_profile.first_name} {to_user_profile.second_name}'

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
