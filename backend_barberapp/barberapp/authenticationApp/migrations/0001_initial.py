# Generated by Django 5.0.3 on 2024-03-25 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Utilizatori',
            fields=[
                ('UserID', models.AutoField(primary_key=True, serialize=False)),
                ('NumePrenume', models.CharField(max_length=256)),
                ('Email', models.EmailField(max_length=256)),
                ('Telefon', models.CharField(max_length=256)),
                ('Parola', models.CharField(max_length=256)),
                ('Rol', models.CharField(default='Client', max_length=256)),
            ],
        ),
    ]
