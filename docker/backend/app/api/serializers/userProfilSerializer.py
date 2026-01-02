from ..models import Utilisateur
from rest_framework import serializers

class UserProfileSerializer(serializers.ModelSerializer):
    role_nom = serializers.CharField(source='id_role.libelle_role', read_only=True)
    email = serializers.EmailField(source='identifiant.mail', read_only=True)
    class Meta:
        model = Utilisateur
        fields = ['nom', 'prenom', 'date_naissance', 'role_nom', 'email']
