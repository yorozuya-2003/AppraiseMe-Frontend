from rest_framework.routers import DefaultRouter
from .views import ProfileViewset, WorkExperienceViewset, ReviewViewSet

user_router = DefaultRouter()
user_router.register(r'addwork', WorkExperienceViewset)
user_router.register(r'addprofile', ProfileViewset)
user_router.register(r'add-review', ReviewViewSet)
