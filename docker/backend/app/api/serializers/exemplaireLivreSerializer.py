from rest_framework import serializers
from ..models import ExemplaireLivres

class ExemplaireLivreSerializer(serializers.ModelSerializer):
    # Ce champ sera rempli par le select_related/prefetch_related du backend
    # On utilise un serializer d'emprunt simplifié pour ne pas alourdir la réponse
    info_emprunt = serializers.SerializerMethodField()

    class Meta:
        model = ExemplaireLivres
        fields = ['id_exemplaire', 'id_livre', 'statut', 'etat', 'info_emprunt']

    def get_info_emprunt(self, obj):
        try:
            # On accède à l'objet Emprunt lié via le OneToOneField
            emp = obj.emprunts 
            return {
                "nom_utilisateur": f"{emp.id_utilisateur.nom} {emp.id_utilisateur.prenom}",
                "date_emprunt": emp.date_emprunt,
                "retour_prevu": emp.retour_prevu
            }
        except:
            return None
