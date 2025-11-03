from rest_framework import serializers
from .models import Compte

class CompteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compte
        fields = ['email', 'mdp']
        extra_kwargs = {'mdp': {'write_only': True}}  # on n’expose pas le mot de passe en GET
