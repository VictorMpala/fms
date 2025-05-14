from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UserDetailView, UserActivationView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('user/activation/', UserActivationView.as_view(), name='user-activation'),
]