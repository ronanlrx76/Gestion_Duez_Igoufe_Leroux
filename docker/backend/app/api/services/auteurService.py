from ..models import Auteur

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
