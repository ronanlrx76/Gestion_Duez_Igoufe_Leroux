from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from ...exceptions import AllParametersAreRequiredException, NotFoundException
from ...serializers import ExemplaireLivreSerializer
from ...services import ExemplaireLivreService
from ...config import IsAdminUserRole
from ...responses import Responses

class ExemplaireLivreView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminUserRole()]

    def post(self, request):
        serializer = ExemplaireLivreSerializer(data=request.data)
        if not serializer.is_valid():
            raise AllParametersAreRequiredException("Les paramètres (id_livre,statut,etat) sont requis")
        exemplaire = ExemplaireLivreService.create_exemplaire(serializer.validated_data)
        return Responses.StandardResponse("success", "Exemplaire créé", ExemplaireLivreSerializer(exemplaire).data, status.HTTP_201_CREATED)
        
    # /?id_livre=x
    def get(self, request):
        id_livre = request.query_params.get('id_livre')
        if not id_livre:
            raise AllParametersAreRequiredException("Le paramètre (id_livre) est requis")
        
        exemplaires = ExemplaireLivreService.get_exemplaires_by_book(id_livre)
        total = ExemplaireLivreService.get_count_by_book(id_livre)
        
        serializer = ExemplaireLivreSerializer(exemplaires, many=True)
        
        data = {
            "total_exemplaires": total,
            "liste": serializer.data
        }
        return Responses.StandardResponse("success", "OK", data, status.HTTP_200_OK)

    # PATCH : Modifier un exemplaire
    def patch(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("Le paramètre (id_livre) est requis")
        
        exemplaire = ExemplaireLivreService.update_exemplaire(id, request.data)
        if exemplaire is None:
            raise NotFoundException()
        
        return Responses.StandardResponse("success", "Exemplaire mis à jour", ExemplaireLivreSerializer(exemplaire).data)
        
        
