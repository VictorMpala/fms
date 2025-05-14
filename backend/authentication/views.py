from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
# CSRF decorators removed
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


import logging

logger = logging.getLogger(__name__)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            
            # Custom validation with detailed error messages
            if not serializer.is_valid():
                # Collect and format validation errors
                errors = {}
                for field, error_list in serializer.errors.items():
                    errors[field] = error_list[0] if error_list else 'Invalid input'
                
                logger.warning(f"Validation failed: {errors}")
                return Response(
                    {
                        'error': 'Validation failed', 
                        'details': errors,
                        'status_code': status.HTTP_400_BAD_REQUEST
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            # Extensive logging for debugging
            logger.info(f"Login attempt for username: {username}")
            
            # Attempt to find user by username or email
            try:
                # First, try to find user by username
                user_obj = User.objects.filter(username=username).first()
                
                # If not found, try by email
                if not user_obj:
                    user_obj = User.objects.filter(email=username).first()
                
                # Authenticate user
                if user_obj:
                    user = authenticate(username=user_obj.username, password=password)
                else:
                    user = None
            except Exception as e:
                logger.error(f"User lookup error: {str(e)}")
                user = None
            
            # Handle authentication failures
            if user is None:
                logger.warning(f"Authentication failed for username: {username}")
                return Response(
                    {
                        'error': 'Invalid credentials', 
                        'details': 'Username or password is incorrect',
                        'status_code': status.HTTP_401_UNAUTHORIZED
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Check if user account is active
            if not user.is_active:
                logger.warning(f"Inactive user login attempt: {username}")
                return Response(
                    {
                        'error': 'Account is not active', 
                        'details': 'User account is disabled',
                        'status_code': status.HTTP_403_FORBIDDEN
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Perform login
            login(request, user)
            logger.info(f"Successful login for username: {username}")
            
            # Return user details
            user_data = UserSerializer(user).data
            user_data['status_code'] = status.HTTP_200_OK
            return Response(user_data)
        
        except Exception as e:
            logger.error(f"Unexpected login error: {str(e)}")
            return Response(
                {
                    'error': 'Login failed', 
                    'details': str(e),
                    'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_object(self):
        return self.request.user

class UserActivationView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        user = request.user
        return Response({
            'is_active': user.is_active,
            'username': user.username,
            'email': user.email
        })
