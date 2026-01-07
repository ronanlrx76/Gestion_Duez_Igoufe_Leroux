from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from ...exceptions import AllParametersAreRequiredException, NotFoundException
from ...responses import Responses
from ...services import BookService
from ...serializers import LivreSerializer
from ...config import IsAdminUserRole

class LivreDetailView(APIView):
    def get_permissions(self):
        # Le GET est ouvert à tous, le DELETE reste admin
        if self.request.method == 'GET':
            return []
        return [IsAuthenticated(), IsAdminUserRole()]
    
    @extend_schema(
        summary="Récupérer les détails d'un livre",
        description="Récupère les informations complètes d'un livre spécifique via son ID.",
        parameters=[
            OpenApiParameter("id", OpenApiTypes.INT, location=OpenApiParameter.PATH, description="ID du livre")
        ],
        responses={200: LivreSerializer} # Utilise ton serializer ici
    )
    def get(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("ID du livre requis")
        
        livre = BookService.get_livre_by_id(id)
        if not livre:
            raise NotFoundException()
            
        serializer = LivreSerializer(livre)
        return Responses.StandardResponse("success", "Détails du livre", serializer.data)
    
    @extend_schema(
        summary="=> Admin | Supprimer un livre",
        description="Supprime définitivement un livre via son ID. Réservé aux administrateurs.",
        parameters=[
            OpenApiParameter("id", OpenApiTypes.INT, location=OpenApiParameter.PATH, description="ID du livre à supprimer")
        ],
        responses={204: None}
    )
    def delete(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("ID du livre requis")
        
        if BookService.delete_livre(id):
            return Responses.StandardResponse("success", "Livre supprimé", http_status=status.HTTP_204_NO_CONTENT)
        raise NotFoundException()
    
    @extend_schema(
        summary="=> Admin | Modifier partiellement un livre",
        description="Met à jour certains champs d'un livre (titre, auteur, ou image). Réservé aux administrateurs.",
        request=LivreSerializer,
        responses={200: LivreSerializer}
    )
    def patch(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("ID du livre requis")
        
        # On récupère les données envoyées dans le corps de la requête
        data = request.data
        
        # On appelle le service pour mettre à jour
        livre_modifie = BookService.update_livre(id, data)
        
        if not livre_modifie:
            raise NotFoundException("Livre non trouvé ou erreur lors de la mise à jour")
            
        serializer = LivreSerializer(livre_modifie)
        return Responses.StandardResponse("success", "Livre mis à jour avec succès", serializer.data)
