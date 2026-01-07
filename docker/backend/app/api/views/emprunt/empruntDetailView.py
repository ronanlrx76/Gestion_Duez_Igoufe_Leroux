from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from ...exceptions import AllParametersAreRequiredException, NotFoundException
from ...services import EmpruntService
from ...responses import Responses
from ...config import IsAdminUserRole

class EmpruntDetailView(APIView):
    def get_permissions(self):
        return [IsAuthenticated(), IsAdminUserRole()] 
    
    @extend_schema(
        summary="=> Admin | Retourner un livre",
        description="Supprime l'emprunt actif et l'archive dans l'historique. Réservé aux bibliothécaires.",
        parameters=[
            OpenApiParameter("id", OpenApiTypes.INT, location=OpenApiParameter.PATH, description="ID de l'exemplaire rendu")
        ],
        responses={200: OpenApiTypes.OBJECT}
    )
    def delete(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("id nécessaire")
        
        success = EmpruntService.retourner_livre(id)
        if success is False:
            raise NotFoundException("Cette référence d'emprunt n'existe pas.")
        
        return Responses.StandardResponse("success", "Livre retourné et historique mis à jour", None, status.HTTP_200_OK)
