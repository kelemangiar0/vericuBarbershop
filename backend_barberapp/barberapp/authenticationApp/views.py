from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from authenticationApp.models import Utilizatori
from authenticationApp.serializers import UtilizatoriSerializer
import jwt, datetime
from rest_framework.renderers import JSONRenderer
# Create your views here.

@csrf_exempt
def registerUser(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        email = data.get('Email')
        telefon = data.get('Telefon')

       

        existing_users = Utilizatori.objects.filter(Email=email)
        if existing_users.exists():
            return JsonResponse({'message': 'Email already registered'}, status=400)
        

        existing_users = Utilizatori.objects.filter(Telefon=telefon)
        if existing_users.exists():
            return JsonResponse({'message': 'Phone already registered'}, status=400)

        serializer = UtilizatoriSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        
        return JsonResponse(serializer.errors, status=400)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)


@csrf_exempt
def loginUser(request):
    if request.method == 'POST':
            data = JSONParser().parse(request)
            email = data.get('Email')
            password = data.get('Parola')
            obfuscated=obfuscate_password(password)

            try:
                user = Utilizatori.objects.get(Email=email, Parola=obfuscated)
            except Utilizatori.DoesNotExist:
                return JsonResponse({'message': 'Invalid credentials'}, status=401)


            payload = {
                'id': user.UserID,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }

            token = jwt.encode(payload, 'secret', algorithm='HS256')

        # Create the response with the token
            response = JsonResponse({'jwt': token})

            # Set the cookie
            response.set_cookie(key='jwt', value=token, httponly=False)

            # Set the renderer to JSONRenderer
            response.accepted_renderer = JSONRenderer()
            
            return response
                
            
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    

def obfuscate_password(password):
    return 'obfuscated_' + password


from django.core.exceptions import ObjectDoesNotExist

@csrf_exempt
def userView(request):
    if request.method == 'GET':
        token = request.COOKIES.get('jwt')
        if not token:
            return JsonResponse({'message': 'Not authenticated'}, status=401)

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            user_id = payload['id']
            user = Utilizatori.objects.get(UserID=user_id)
            serializer = UtilizatoriSerializer(user)
            return JsonResponse(serializer.data)
        except jwt.ExpiredSignatureError:
            return JsonResponse({'message': 'Token expired'}, status=401)
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        

@csrf_exempt
def logoutView(request):
    if request.method == 'POST':
        response = JsonResponse({'message': 'success'})
        response.delete_cookie('jwt')
        return response
    
@csrf_exempt
def all_users(request):
    if request.method == 'GET':
        users = Utilizatori.objects.all()
        serializer = UtilizatoriSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    

@csrf_exempt
def delete_user(request, user_id):
    if request.method == 'DELETE':
        try:
            user = Utilizatori.objects.get(UserID=user_id)
            user.delete()
            return JsonResponse({'message': 'User deleted successfully'}, status=204)
        except Utilizatori.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    
@csrf_exempt
def modify_user(request, user_id):
    if request.method == 'PUT':
        try:
            user = Utilizatori.objects.get(UserID=user_id)
            data = JSONParser().parse(request)
            serializer = UtilizatoriSerializer(user, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            else:
                return JsonResponse(serializer.errors, status=400)

        except Utilizatori.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
