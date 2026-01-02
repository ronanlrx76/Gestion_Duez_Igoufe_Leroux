from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from ...exceptions import AllParametersAreRequiredException, NotFoundException
from ...responses import Responses
from ...serializers import LivreSerializer
from ...services import BookService
from ...config import IsAdminUserRole

class LivreView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminUserRole()]

    # GET : Liste des livres
    def get(self, request):
        livres = BookService.get_all_livres()
        serializer = LivreSerializer(livres, many=True)
        return Responses.StandardResponse("success", "OK", serializer.data, status.HTTP_200_OK)

    # POST : Ajouter un livre
    def post(self, request):
        serializer = LivreSerializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            raise AllParametersAreRequiredException("Titre et id_auteur sont requis")
        
        livre = BookService.create_livre(serializer.validated_data)
        return Responses.StandardResponse("success", "Livre ajouté", LivreSerializer(livre).data, status.HTTP_201_CREATED)

    # DELETE : Supprimer un livre
    def delete(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("ID du livre requis")
        
        if BookService.delete_livre(id):
            return Responses.StandardResponse("success", "Livre supprimé", http_status=status.HTTP_204_NO_CONTENT)
        raise NotFoundException()
