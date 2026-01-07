from ..models import Auteur
from ..serializers import AuteurSerializer 

class AuthorService:
    @staticmethod
    def get_all_auteurs():
        return Auteur.objects.all()

    @staticmethod
    def create_auteur(data):
        # data est déjà validé par le serializer
        return Auteur.objects.create(**data)

    @staticmethod
    def delete_auteur(auteur_id):
        auteur = Auteur.objects.filter(pk=auteur_id).first()
        if auteur:
            auteur.delete()
            return True
        return False
    
    @staticmethod
    def update_auteur(auteur_id, data):
        try:
            # On récupère l'instance de l'auteur
            auteur = Auteur.objects.get(pk=auteur_id)
            
            # partial=True est crucial pour le PATCH
            serializer = AuteurSerializer(auteur, data=data, partial=True)
            
            if serializer.is_valid():
                return serializer.save()
            else:
                # Optionnel : logguez serializer.errors pour voir pourquoi la validation échoue
                return None
                
        except Auteur.DoesNotExist:
            return None
