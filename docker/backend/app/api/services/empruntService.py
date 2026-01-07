from django.db import transaction

from ..models import Emprunt
from .exemplaireLivreService import ExemplaireLivreService
from .historiqueEmpruntService import HistoriqueEmpruntService

class EmpruntService:
    @staticmethod
    @transaction.atomic # Pour garantir que si l'un échoue, l'autre s'annule
    def creer_emprunt(data):
        # Trouver un livre 
        livre_id = data.pop('id_livre')
        exemplaireLivre = ExemplaireLivreService.get_one_exemplaire(livre_id)
        if exemplaireLivre is None:
            return None
        
        data['id_exemplaire'] = exemplaireLivre
        emprunt = Emprunt.objects.create(**data)
        
        # Mettre à jour le statut de l'exemplaire
        ExemplaireLivreService.update_statut(exemplaireLivre, "emprunté")
        
        return emprunt

    @staticmethod
    def get_emprunts_utilisateur(id_utilisateur):
        return Emprunt.objects.filter(id_utilisateur=id_utilisateur)
    
    @staticmethod
    @transaction.atomic
    def retourner_livre(id_exemplaire):
        try:
            # 1. Récupérer l'emprunt actuel
            emprunt = Emprunt.objects.get(id_exemplaire=id_exemplaire)
            
            # 2. Créer l'entrée dans l'historique
            HistoriqueEmpruntService.archiver_emprunt(emprunt)
            
            # 3. Mettre à jour le statut de l'exemplaire via ton service
            ExemplaireLivreService.update_statut(emprunt.id_exemplaire, "disponible")
            
            # 4. Supprimer l'emprunt actif
            emprunt.delete()
            
            return True
        except Emprunt.DoesNotExist:
            return False
