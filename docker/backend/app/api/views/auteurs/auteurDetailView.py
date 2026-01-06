from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from ...exceptions import AllParametersAreRequiredException, NotFoundException
from ...responses import Responses
from ...services import AuthorService
from ...config import IsAdminUserRole # Ta nouvelle permission

class AuteurDetailView(APIView):
    def get_permissions(self):
        return [IsAuthenticated(), IsAdminUserRole()] 
    
    # DELETE : Supprimer un auteur (via un paramètre d'URL ou query)
    @extend_schema(
        summary="Supprimer un auteur => Admin",
        request=int,
        responses={
            204: None
        }
    )
    def delete(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("Le paramètre (id) est requis")
        
        success = AuthorService.delete_auteur(id)
        if not success:
            raise NotFoundException()
        return Responses.StandardResponse("success", "Auteur supprimé", http_status=status.HTTP_204_NO_CONTENT)
