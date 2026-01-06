from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from ...exceptions import AllParametersAreRequiredException
from ...serializers import ExemplaireLivreSerializer
from ...services import ExemplaireLivreService
from ...config import IsAdminUserRole
from ...responses import Responses

class ExemplaireLivreView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminUserRole()]

    @extend_schema(
        summary="=> Admin | Créer un exemplaire",
        description="Ajoute un exemplaire physique pour un livre spécifique. Nécessite id_livre, statut et etat.",
        request=ExemplaireLivreSerializer,
        responses={201: ExemplaireLivreSerializer}
    )
    def post(self, request):
        serializer = ExemplaireLivreSerializer(data=request.data)
        if not serializer.is_valid():
            raise AllParametersAreRequiredException("Les paramètres (id_livre,statut,etat) sont requis")
        exemplaire = ExemplaireLivreService.create_exemplaire(serializer.validated_data)
        return Responses.StandardResponse("success", "Exemplaire créé", ExemplaireLivreSerializer(exemplaire).data, status.HTTP_201_CREATED)
        
    # /?id_livre=x
    @extend_schema(
        summary="Liste des exemplaires d'un livre",
        description="Récupère tous les exemplaires physiques rattachés à un ID de livre spécifique.",
        parameters=[
            OpenApiParameter("id_livre", OpenApiTypes.INT, location=OpenApiParameter.QUERY, description="ID du livre parent", required=True)
        ],
        responses={200: OpenApiTypes.OBJECT}
    )
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

        
        
