from rest_framework import serializers
from ..models import Livre, Auteur

class LivreSerializer(serializers.ModelSerializer):
    # On déclare les champs annotés pour qu'ils apparaissent dans le JSON
    nb_exemplaires = serializers.IntegerField(source='total_ex', read_only=True)
    nb_disponibles = serializers.IntegerField(source='total_dispo', read_only=True)

    class Meta:
        model = Livre
        fields = [
            'id_livre', 
            'titre', 
            'id_auteur', 
            'emplacement_image_couverture', 
            'nb_exemplaires', 
            'nb_disponibles'
        ]
