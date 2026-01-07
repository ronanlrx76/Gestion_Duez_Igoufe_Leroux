from ..models import Livre
from ..serializers import LivreSerializer
from django.db.models import Count, Q

class BookService:
    @staticmethod
    def get_all_livres(titre=None):
        query = Livre.objects.select_related('id_auteur').all().order_by('id_livre')
        if titre:
            query = query.filter(titre__icontains=titre)

        queryset = query.annotate(
            total_ex=Count('exemplaires'),
            total_dispo=Count('exemplaires', filter=Q(exemplaires__statut='disponible'))
        )
        return queryset
    
    @staticmethod
    def get_livre_by_id(id_livre):
        """Récupère un livre par son ID ou retourne None."""
        try:
            return  Livre.objects.select_related('id_auteur').annotate(
                total_ex=Count('exemplaires'),
                total_dispo=Count('exemplaires', filter=Q(exemplaires__statut__iexact='disponible'))
            ).get(id_livre=id_livre)
        except Livre.DoesNotExist:
            return None

    @staticmethod
    def create_livre(data):
        return Livre.objects.create(**data)

    @staticmethod
    def delete_livre(id_livre):
        try:
            livre = Livre.objects.get(id_livre=id_livre)
            livre.delete()
            return True
        except Livre.DoesNotExist:
            return False
        
    @staticmethod
    def update_livre(livre_id, data):
        try:
            # 1. Récupérer l'instance existante
            livre = Livre.objects.get(pk=livre_id)
            
            # 2. Utiliser le serializer pour valider et sauvegarder
            # partial=True permet de ne pas exiger TOUS les champs du modèle
            serializer = LivreSerializer(livre, data=data, partial=True)
            
            if serializer.is_valid():
                return serializer.save()
            else:
                # Tu peux logger serializer.errors ici pour le debug
                return None
                
        except Livre.DoesNotExist:
            return None
