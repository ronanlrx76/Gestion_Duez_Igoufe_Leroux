from ..models import ExemplaireLivres

class ExemplaireLivreService:
    @staticmethod
    def create_exemplaire(data):
        return ExemplaireLivres.objects.create(**data)
    
    @staticmethod
    def get_exemplaires_by_book(id_livre):
        # Récupère tous les exemplaires pour un livre donné
        return ExemplaireLivres.objects.filter(id_livre=id_livre)

    @staticmethod
    def get_count_by_book(id_livre):
        # Retourne le nombre total d'exemplaires pour ce livre
        return ExemplaireLivres.objects.filter(id_livre=id_livre).count()

    @staticmethod
    def update_exemplaire(id_exemplaire, data):
        try:
            exemplaire = ExemplaireLivres.objects.get(id_exemplaire=id_exemplaire)
            for key, value in data.items():
                setattr(exemplaire, key, value)
            exemplaire.save()
            return exemplaire
        except ExemplaireLivres.DoesNotExist:
            return None
        
    @staticmethod
    def update_statut(exemplaire, nouveau_statut):
        exemplaire.statut = nouveau_statut
        exemplaire.save()
        return exemplaire
    
    @staticmethod
    def get_one_exemplaire(id_livre: int, etat=None):
        query = ExemplaireLivres.objects.filter(
            id_livre=id_livre, 
            statut='disponible'
        )
        
        if etat is not None:
            query = query.filter(etat=etat)
        
        return query.first()
