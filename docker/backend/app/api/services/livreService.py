from ..models import Livre

class BookService:
    @staticmethod
    def get_all_livres(titre=None):
        query = Livre.objects.all().order_by('id_livre')
        if titre:
            query = query.filter(titre__icontains=titre)
        return query

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
