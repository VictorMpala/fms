# Simple Dockerfile for Django Backend
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Expose port 8000 for Django
EXPOSE 8000

CMD ["gunicorn", "fleet_management.wsgi:application", "--bind", "0.0.0.0:8000"]
