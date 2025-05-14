from django.urls import path
from . import views

urlpatterns = [
    path('sensor-data/', views.receive_sensor_data, name='receive_sensor_data'),
    path('latest-data/', views.get_latest_data, name='get_latest_data'),
]
