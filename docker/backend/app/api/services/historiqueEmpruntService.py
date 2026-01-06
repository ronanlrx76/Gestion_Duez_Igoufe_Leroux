from ..models import HistoriqueEmprunt
from django.utils import timezone

class HistoriqueEmpruntService:
    @staticmethod
    def archiver_emprunt(emprunt):
        """Transforme un objet Emprunt actif en archive historique."""
        return HistoriqueEmprunt.objects.create(
            date_emprunt=emprunt.date_emprunt,
            retour_prevu=emprunt.retour_prevu,
            date_retour_effectif=timezone.now().date(),
            id_utilisateur=emprunt.id_utilisateur,
            id_exemplaire=emprunt.id_exemplaire
        )

    @staticmethod
    def get_historique_utilisateur(id_utilisateur):
        """Récupère tout le passé d'un utilisateur, du plus récent au plus ancien."""
        return HistoriqueEmprunt.objects.filter(
            id_utilisateur=id_utilisateur
        ).order_by('-date_retour_effectif')
