from rest_framework import serializers
from ..models import Emprunt, Livre, Utilisateur
from datetime import date

class EmpruntSerializer(serializers.ModelSerializer):
    # Champ manuel pour recevoir l'ID du livre
    id_livre = serializers.PrimaryKeyRelatedField(queryset=Livre.objects.all(), write_only=True)
    id_utilisateur = serializers.PrimaryKeyRelatedField(queryset=Utilisateur.objects.all())

    class Meta:
        model = Emprunt
        # On inclut id_livre pour l'entrée, mais le modèle utilisera id_exemplaire
        fields = ['id_livre', 'id_exemplaire', 'date_emprunt', 'retour_prevu', 'id_utilisateur']
        # On rend id_exemplaire optionnel car c'est le service qui va le trouver
        extra_kwargs = {'id_exemplaire': {'required': False}}

    def validate(self, data):
        if data['retour_prevu'] <= data.get('date_emprunt', date.today()):
            raise serializers.ValidationError("La date de retour prévu doit être après la date d'emprunt.")
        return data
