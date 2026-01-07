from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from ...exceptions import AllParametersAreRequiredException, NotFoundException
from ...serializers import ExemplaireLivreSerializer
from ...services import ExemplaireLivreService
from ...config import IsAdminUserRole
from ...responses import Responses

class ExemplaireLivreDetailView(APIView):
    def get_permissions(self):
        return [IsAuthenticated(), IsAdminUserRole()]

    # PATCH : Modifier un exemplaire
    @extend_schema(
        summary="=> Admin | Modifier un exemplaire",
        description="Mise à jour partielle d'un exemplaire (ex: changer son état ou son statut).",
        parameters=[
            OpenApiParameter("id", OpenApiTypes.INT, location=OpenApiParameter.PATH, description="ID de l'exemplaire physique")
        ],
        request=ExemplaireLivreSerializer, # Le schéma montrera les champs modifiables
        responses={200: ExemplaireLivreSerializer}
    )
    def patch(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("Le paramètre (id_livre) est requis")
        
        exemplaire = ExemplaireLivreService.update_exemplaire(id, request.data)
        if exemplaire is None:
            raise NotFoundException()
        
        return Responses.StandardResponse("success", "Exemplaire mis à jour", ExemplaireLivreSerializer(exemplaire).data)
