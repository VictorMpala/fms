# Fleet Management System Backend

This is the backend for the Fleet Management System, providing authentication services for the React frontend.

## Features

- User authentication (register, login, logout)
- User profile management
- Session-based authentication
- REST API endpoints for frontend integration

## Technology Stack

- Django
- Django REST Framework
- SQLite database
- CORS headers for frontend integration

## Setup

1. Install required packages:

```bash
pip install django djangorestframework django-cors-headers
```

2. Apply database migrations:

```bash
python manage.py migrate
```

3. Create a superuser (optional, for admin access):

```bash
python manage.py createsuperuser
```

4. Run the development server:

```bash
python manage.py runserver
```

The server will start at http://localhost:8000.

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register/`
  - Request body: `{username, email, password, password2, first_name, last_name}`
  - Returns: User data

- **Login**: `POST /api/auth/login/`
  - Request body: `{username, password}`
  - Returns: User data

- **Logout**: `POST /api/auth/logout/`
  - No request body needed
  - Returns: 200 OK

- **User Details**: `GET /api/auth/user/`
  - Returns: User data

## Testing

You can use the provided test script to test the authentication API:

```bash
python test_api.py
```

## Integration with Frontend

The frontend should connect to these API endpoints for authentication. Session cookies are used for maintaining the authentication state. 