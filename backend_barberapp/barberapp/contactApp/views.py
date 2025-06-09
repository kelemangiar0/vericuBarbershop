from django.shortcuts import render
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
#import pywhatkit
import re
from barberapp.settings import EMAIL_HOST_USER

@csrf_exempt
def sendConfirmProgramare(request):
    if request.method == 'POST':
        dataPost = JSONParser().parse(request)
        nume = dataPost.get('NumeUser')
        telefon = dataPost.get('Telefon')
        data = dataPost.get('Data')
        ora = dataPost.get('Ora')
        serviciu = dataPost.get('Serviciu')
        
        if nume and telefon and data and ora:
            if not re.match(r'^\+40\d{9}$', telefon):
                telefon = '+4' + telefon

            mesaj = f"Salut {nume}, rezervarea {serviciu} de pe data de {data} ora {ora} a fost confirmata! Te astept cu drag in salon!"
            toPhone = telefon
            
            try:
                #pywhatkit.sendwhatmsg_instantly(toPhone, mesaj, 15, tab_close=False)
                return JsonResponse({'message': 'WhatsApp message sent successfully'}, status=200)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'Missing or empty required fields'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def sendAnulareConfirm(request):
    if request.method == 'POST':
        dataPost = JSONParser().parse(request)
        nume = dataPost.get('NumeUser')
        telefon = dataPost.get('Telefon')
        data = dataPost.get('Data')
        ora = dataPost.get('Ora')
        serviciu = dataPost.get('Serviciu')
        
        if nume and telefon and data and ora:
            if not re.match(r'^\+40\d{9}$', telefon):
                telefon = '+4' + telefon

            mesaj = f"Salut {nume}, rezervarea {serviciu} de pe data de {data} ora {ora} a fost anulata!"
            toPhone = telefon
            
            try:
                #pywhatkit.sendwhatmsg_instantly(toPhone, mesaj, 15, tab_close=False)
                return JsonResponse({'message': 'WhatsApp message sent successfully'}, status=200)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'Missing or empty required fields'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def sendEmail(request):
    if request.method == 'POST':
        dataPost = JSONParser().parse(request)
        nume=dataPost.get('Nume')
        msg=dataPost.get('Mesaj')
        #telefon=dataPost.get('Telefon')

        email=dataPost.get('Email')
        subiect = 'Mulțumim că ne-ai contactat!'
        mesaj=f'Salut {nume}, am primit formularul tău! Vom încerca să îți răspundem în cel mai scurt timp. Îți mulțumim că ne-ai contactat!\n\n\'{msg}\''

        dest=[email]
        send_mail(subiect, mesaj, EMAIL_HOST_USER, dest, fail_silently=True)

        return JsonResponse({'status': 'Email sent successfully.'})
    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
