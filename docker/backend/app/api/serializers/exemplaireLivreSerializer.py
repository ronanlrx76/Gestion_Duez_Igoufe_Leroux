from rest_framework import serializers
from ..models import ExemplaireLivres, Livre

class ExemplaireLivreSerializer(serializers.ModelSerializer):
    # Comme pour les livres, on gère la FK par ID
    id_livre = serializers.PrimaryKeyRelatedField(queryset=Livre.objects.all())

    class Meta:
        model = ExemplaireLivres
        fields = ['id_exemplaire', 'id_livre', 'statut', 'etat']
        read_only_fields = ['id_exemplaire']
