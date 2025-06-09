from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse, HttpResponseNotAllowed
from programariApp.models import Programari
from programariApp.serializers import ProgramariSerializer

@csrf_exempt
def all_programari(request):
    if request.method == 'GET':
        programari = Programari.objects.all()
        serializer = ProgramariSerializer(programari, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

@csrf_exempt
def programari_for_user(request, user_id):
    if request.method == 'GET':
        programari = Programari.objects.filter(UserID=user_id)
        serializer = ProgramariSerializer(programari, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])


@csrf_exempt
def make_programare(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = ProgramariSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
def delete_programare(request, programare_id):
    if request.method == 'DELETE':
        try:
            programare = Programari.objects.get(ProgramareID=programare_id)
            programare.delete()
            return JsonResponse({'message': 'Programare deleted successfully'}, status=204)
        except Programari.DoesNotExist:
            return JsonResponse({'error': 'Programare not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return HttpResponseNotAllowed(['DELETE'])
    
    

from programariApp.models import ProgramLucru
from programariApp.serializers import ProgramLucruSerializer


@csrf_exempt
def getProgramLucru(request):
    if request.method == 'GET':
        programari = ProgramLucru.objects.all()
        serializer = ProgramLucruSerializer(programari, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
    
@csrf_exempt
def insertProgramLucru(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = ProgramLucruSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return HttpResponseNotAllowed(['POST'])

@csrf_exempt
def deleteFromProgramLucru(request, zi):
    try:
        programari = ProgramLucru.objects.filter(Zi=zi)
        if programari.exists():
            programari.delete()
            return JsonResponse({'message': 'Programări deleted successfully'}, status=204)
        else:
            return JsonResponse({'error': 'Nu există programări pentru data specificată'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def deleteAllFromProgramari(request, data):
    try:
        programari = Programari.objects.filter(Data=data)
        if programari.exists():
            #for programare in programari:
                #send_cancel_confirmation(programare)

            programari.delete()
            return JsonResponse({'message': 'Toate programările pentru data specificată au fost șterse cu succes'}, status=204)
        else:
            return JsonResponse({'error': 'Nu există programări pentru data specificată'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

import re
#import pywhatkit 
def send_cancel_confirmation(programare):
    nume = programare.NumeUser
    telefon = programare.Telefon
    data = programare.Data
    ora = programare.Ora
    serviciu = programare.Serviciu

    if nume and telefon and data and ora:
        if not re.match(r'^\+40\d{9}$', telefon):
            telefon = '+4' + telefon

        mesaj = f"Salut {nume}, rezervarea {serviciu} de pe data de {data} ora {ora} a fost anulată din cauza anulării zilei de lucru! Vezi alte date disponibile."
        toPhone = telefon

        try:
            print('placeholder')
            #pywhatkit.sendwhatmsg_instantly(toPhone, mesaj, 15, tab_close=False)
        except Exception as e:
            print(f"Eroare la trimiterea mesajului către {toPhone}: {e}")
    
from datetime import datetime, timedelta

from datetime import datetime
from django.http import JsonResponse
from programariApp.models import ProgramLucru, Programari

@csrf_exempt
def get_working_hours(request):
    if request.method == 'GET':
        try:
            formatted_date_str = request.GET.get('date')
            if not formatted_date_str:
                return JsonResponse({'error': 'Date parameter is missing'}, status=400)

            formatted_date = datetime.strptime(formatted_date_str, '%Y-%m-%d')
            
            # Get all available hours for the selected date from ProgramLucru model
            program_lucru = ProgramLucru.objects.filter(Zi=formatted_date).first()
            if program_lucru:
                prima_ora_datetime = datetime.combine(formatted_date, program_lucru.PrimaOra)
                numar_ore = program_lucru.NumarOre
                available_hours = [(prima_ora_datetime + timedelta(hours=i)).strftime('%H:%M:%S') for i in range(numar_ore)]
                
                # Exclude hours that are already reserved (present in Programari model)
                reserved_hours = Programari.objects.filter(Data=formatted_date).values_list('Ora', flat=True)
                reserved_hours = [hour.strftime('%H:%M:%S') for hour in reserved_hours]
                available_hours = [hour for hour in available_hours if hour not in reserved_hours]
                
                return JsonResponse({'non_reserved_hours': available_hours})
            else:
                return JsonResponse({'error': 'No working hours available for the selected date'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)