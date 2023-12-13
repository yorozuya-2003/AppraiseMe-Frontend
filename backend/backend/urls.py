from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from main.api.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.api.urls')),

    # path('add_work/', addwork_exp, name='add_work'),

    path('send_otp/', send_otp, name='send_otp'),
    path('verify_otp/', verify_otp, name='verify_otp'),
    path('register_user/', register_user, name='register_user'),
    path('user_login/', user_login, name='user_login'),
    # path('create_user/', create_user, name='create_user'),
    path('user/<str:username>/', user_profile, name='user_profile'),
    # path('get-user-email/<str:username>', get_user_email, name="get_user_email")

    path('get_reviews/<str:to_user_email>/', get_reviews_for_user, name='get_reviews_for_user'),
    path('get_profile/<str:email>/', get_profile, name='get_profile'),
    path('check_profile/<str:email>/', check_profile_completion, name='check_profile'),
    path('search-suggestions/', search_suggestions, name='search_suggestions'),

    path('update_bio/<str:email>/', update_bio, name='update_bio'),
    path('update_image/<str:email>/', update_image, name='update_image'),

    path('upvote_review/<int:review_id>', upvote_review, name='upvote_review'),
    path('downvote_review/<int:review_id>', downvote_review, name='downvote_review'),

    path('delete_review/<int:review_id>', delete_review, name='delete_review'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
