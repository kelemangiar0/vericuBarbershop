from rest_framework import serializers
from serviciiApp.models import Servicii

class ServiciiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicii
        fields = ('ServiciuID', 'Nume', 'Pret', 'Descriere')

    def create(self, validated_data):
        return Servicii.objects.create(**validated_data)