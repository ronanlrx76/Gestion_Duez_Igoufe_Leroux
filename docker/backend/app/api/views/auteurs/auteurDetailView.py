from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from ...exceptions import AllParametersAreRequiredException, NotFoundException
from ...responses import Responses
from ...services import AuthorService
from ...config import IsAdminUserRole 
from ...serializers import AuteurSerializer 

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
    
    @extend_schema(
        summary="=> Admin | Modifier partiellement un auteur",
        description="Met à jour le nom ou le prénom d'un auteur via son ID.",
        request=AuteurSerializer,
        responses={200: AuteurSerializer}
    )
    def patch(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("Le paramètre (id) est requis")
        
        # On envoie les données (request.data) au service
        auteur_modifie = AuthorService.update_auteur(id, request.data)
        
        if not auteur_modifie:
            raise NotFoundException("Auteur non trouvé ou données invalides")
            
        serializer = AuteurSerializer(auteur_modifie)
        return Responses.StandardResponse("success", "Auteur mis à jour", serializer.data)
