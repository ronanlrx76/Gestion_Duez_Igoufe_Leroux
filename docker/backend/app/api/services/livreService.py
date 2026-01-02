from ..models import Livre

class BookService:
    @staticmethod
    def get_all_livres():
        return Livre.objects.all()

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
