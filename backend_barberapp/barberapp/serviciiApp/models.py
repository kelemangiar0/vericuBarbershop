from django.db import models

# Create your models here.

class Servicii(models.Model):
    ServiciuID = models.AutoField(primary_key=True)
    Nume = models.CharField(max_length=255)
    Pret = models.IntegerField()
    Descriere = models.CharField(max_length=256)