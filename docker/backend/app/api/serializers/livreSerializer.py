from rest_framework import serializers
from ..models import Livre, Auteur

class LivreSerializer(serializers.ModelSerializer):
    id_auteur = serializers.PrimaryKeyRelatedField(queryset=Auteur.objects.all())

    class Meta:
        model = Livre
        fields = ['id_livre', 'titre', 'id_auteur', 'emplacement_image_couverture']
        read_only_fields = ['id_livre']
