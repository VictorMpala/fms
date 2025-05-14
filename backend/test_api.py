#!/usr/bin/env python
import requests
import json

# Server URL
BASE_URL = 'http://localhost:8000/api/auth'

def register_user():
    url = f"{BASE_URL}/register/"
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "StrongPassword123!",
        "password2": "StrongPassword123!",
        "first_name": "Test",
        "last_name": "User"
    }
    
    response = requests.post(url, data=data)
    print("Register Response:", response.status_code)
    if response.status_code == 201:
        print("User registered successfully!")
    else:
        print(response.json())
    
    return response.status_code == 201

def login_user():
    url = f"{BASE_URL}/login/"
    data = {
        "username": "testuser",
        "password": "StrongPassword123!"
    }
    
    response = requests.post(url, data=data)
    print("Login Response:", response.status_code)
    
    if response.status_code == 200:
        print("User logged in successfully!")
        print(response.json())
        return response.cookies
    else:
        print(response.json())
        return None

def get_user_details(cookies):
    url = f"{BASE_URL}/user/"
    response = requests.get(url, cookies=cookies)
    print("User Details Response:", response.status_code)
    
    if response.status_code == 200:
        print("User details retrieved successfully!")
        print(response.json())
    else:
        print(response.json())

def logout_user(cookies):
    url = f"{BASE_URL}/logout/"
    response = requests.post(url, cookies=cookies)
    print("Logout Response:", response.status_code)
    
    if response.status_code == 200:
        print("User logged out successfully!")
    else:
        print(response.json())

if __name__ == "__main__":
    print("Testing the authentication API...")
    
    # Try to register a user
    register_success = register_user()
    
    # Login
    cookies = login_user()
    
    if cookies:
        # Get user details
        get_user_details(cookies)
        
        # Logout
        logout_user(cookies) 