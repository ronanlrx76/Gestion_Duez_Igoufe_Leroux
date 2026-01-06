from rest_framework import serializers
from ..models import HistoriqueEmprunt

class HistoriqueEmpruntSerializer(serializers.ModelSerializer):
    # On peut ajouter le titre du livre ici via une relation si besoin
    class Meta:
        model = HistoriqueEmprunt
        fields = '__all__'
