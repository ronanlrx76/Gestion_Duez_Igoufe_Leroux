from ..models import ExemplaireLivres
from ..serializers import ExemplaireLivreSerializer

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
            # 1. Récupérer l'instance existante
            exemplaire = ExemplaireLivres.objects.get(id_exemplaire=id_exemplaire)
            
            # 2. Utiliser le serializer avec partial=True
            # Cela gère tout seul le problème de la ForeignKey (id_livre)
            serializer = ExemplaireLivreSerializer(exemplaire, data=data, partial=True)
            
            if serializer.is_valid():
                return serializer.save()
            else:
                # Optionnel: print(serializer.errors) pour debugger
                return None
            
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
