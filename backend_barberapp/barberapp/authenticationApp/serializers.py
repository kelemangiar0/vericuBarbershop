from rest_framework import serializers
from authenticationApp.models import Utilizatori

class UtilizatoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizatori
        fields = ('UserID', 'NumePrenume', 'Email', 'Telefon', 'Parola', 'Rol')
    def create(self, validated_data):
        validated_data['Parola'] = self.obfuscate_password(validated_data.get('Parola', ''))
        return Utilizatori.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.NumePrenume = validated_data.get('NumePrenume', instance.NumePrenume)
        instance.Email = validated_data.get('Email', instance.Email)
        instance.Telefon = validated_data.get('Telefon', instance.Telefon)
        instance.Rol = validated_data.get('Rol', instance.Rol)
        
        # Check if password is provided in the request data
        if 'Parola' in validated_data:
            instance.Parola = self.obfuscate_password(validated_data.get('Parola', ''))

        instance.save()
        return instance

    def obfuscate_password(self, password):
        return 'obfuscated_' + password