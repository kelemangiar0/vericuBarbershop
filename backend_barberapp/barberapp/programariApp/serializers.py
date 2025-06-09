from rest_framework import serializers
from programariApp.models import Programari
from programariApp.models import ProgramLucru

class ProgramariSerializer(serializers.ModelSerializer):

    class Meta:
        model = Programari
        fields = ('ProgramareID', 'UserID', 'NumeUser', 'Telefon', 'Serviciu', 'Data', 'Ora')

    def create(self, validated_data):
        return Programari.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.UserID = validated_data.get('UserID', instance.UserID)
        instance.Telefon = validated_data.get('Telefon', instance.Telefon)
        instance.NumeUser = validated_data.get('NumeUser', instance.NumeUser)
        instance.Serviciu = validated_data.get('Serviciu', instance.Serviciu)
        instance.Data = validated_data.get('Data', instance.Data)
        instance.Ora = validated_data.get('Ora', instance.Ora)
        instance.save()
        return instance

class ProgramLucruSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProgramLucru
        fields = ('ID', 'Zi', 'PrimaOra', 'NumarOre')

    def create(self, validated_data):
        return ProgramLucru.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Zi = validated_data.get('Zi', instance.Zi)
        instance.PrimaOra = validated_data.get('PrimaOra', instance.PrimaOra)
        instance.NumarOre = validated_data.get('NumarOre', instance.NumarOre)
        instance.save()
        return instance