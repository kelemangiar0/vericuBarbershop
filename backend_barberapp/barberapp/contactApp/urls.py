from django.urls import path
from contactApp.views import sendConfirmProgramare
from contactApp.views import sendEmail
from contactApp.views import sendAnulareConfirm

urlpatterns = [
    path('sendConfirmProgramare/', sendConfirmProgramare),
    path('sendContactEmail/', sendEmail),
    path('sendAnulareConfirm/', sendAnulareConfirm),
]