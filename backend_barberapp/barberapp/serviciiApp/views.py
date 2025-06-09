from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from serviciiApp.models import Servicii
from serviciiApp.serializers import ServiciiSerializer
from rest_framework.parsers import JSONParser
from rest_framework import status

@csrf_exempt
def all_servicii(request):
    if request.method == 'GET':
        servicii = Servicii.objects.all()
        serializer = ServiciiSerializer(servicii, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
def delete_serviciu(request, serviciu_id):
    if request.method == 'DELETE':
        try:
            serviciu = Servicii.objects.get(ServiciuID=serviciu_id)
            serviciu.delete()
            return JsonResponse({'message': 'Serviciu deleted successfully'}, status=204)
        except Servicii.DoesNotExist:
            return JsonResponse({'message': 'Serviciu not found'}, status=404)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    
@csrf_exempt
def add_serviciu(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = ServiciiSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    


@csrf_exempt
def modify_serviciu(request, serviciu_id):
    try:
        serviciu = Servicii.objects.get(ServiciuID=serviciu_id)
    except Servicii.DoesNotExist:
        return JsonResponse({'message': 'Serviciu not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = ServiciiSerializer(serviciu, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)