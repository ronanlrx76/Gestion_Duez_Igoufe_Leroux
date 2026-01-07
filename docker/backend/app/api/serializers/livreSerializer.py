from rest_framework import serializers
from ..models import Livre
from .exemplaireLivreSerializer import ExemplaireLivreSerializer

class LivreSerializer(serializers.ModelSerializer):
    # On récupère les infos de l'auteur via la relation ForeignKey
    # 'id_auteur' est le nom du champ dans ton modèle Livre
    nom_auteur = serializers.CharField(source='id_auteur.nom', read_only=True)
    prenom_auteur = serializers.CharField(source='id_auteur.prenom', read_only=True)
    
    # Tes champs de pagination/comptage précédents
    nb_exemplaires = serializers.IntegerField(source='total_ex', read_only=True)
    nb_disponibles = serializers.IntegerField(source='total_dispo', read_only=True)

    exemplaires_details = ExemplaireLivreSerializer(source='exemplaires', many=True, read_only=True)
    class Meta:
        model = Livre
        fields = [
            'id_livre', 'titre', 'emplacement_image_couverture',
            'nom_auteur', 'prenom_auteur', 
            'nb_exemplaires', 'nb_disponibles', 'exemplaires_details'
        ]
