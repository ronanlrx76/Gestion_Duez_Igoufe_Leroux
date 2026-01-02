from rest_framework import serializers
from ..models import Auteur

class AuteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auteur
        # On expose tout pour l'auteur
        fields = ['id_auteur', 'nom', 'prenom']
        # L'id est généré par la DB, on ne veut pas que l'utilisateur le saisisse
        read_only_fields = ['id_auteur']
