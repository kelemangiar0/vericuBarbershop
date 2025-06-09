from django.db import models
from authenticationApp.models import Utilizatori
# Create your models here.


class Programari(models.Model):
    ProgramareID = models.AutoField(primary_key=True)
    UserID = models.ForeignKey(Utilizatori, on_delete=models.CASCADE, null=True, blank=True)
    Telefon = models.CharField(max_length=256, default='notSet')
    NumeUser = models.CharField(max_length=256, default='notSet')
    Serviciu = models.CharField(max_length=256, default='notSet')
    Data = models.DateField()
    Ora = models.TimeField()


class ProgramLucru(models.Model):
    ID = models.AutoField(primary_key=True)
    Zi = models.DateField()
    PrimaOra = models.TimeField()
    NumarOre = models.IntegerField()