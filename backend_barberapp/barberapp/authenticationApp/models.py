from django.db import models

# Create your models here.


class Utilizatori(models.Model):
    UserID=models.AutoField(primary_key=True)
    NumePrenume=models.CharField(max_length=256, null=False)
    Email=models.EmailField(max_length=256, null=False)
    Telefon=models.CharField(max_length=256, null=False)
    Parola=models.CharField(max_length=256,null=False)
    Rol = models.CharField(max_length=256, null=False, default='Client')