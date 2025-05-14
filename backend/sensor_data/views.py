from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

latest_data = {}

@csrf_exempt
def receive_sensor_data(request):
    global latest_data
    if request.method == 'POST':
        latest_data = json.loads(request.body)
        return JsonResponse({'status': 'received'})

def get_latest_data(request):
    return JsonResponse(latest_data)
