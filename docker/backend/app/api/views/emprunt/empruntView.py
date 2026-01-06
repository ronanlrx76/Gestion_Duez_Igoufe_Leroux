from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from ...exceptions import AllParametersAreRequiredException, NotFoundException
from ...serializers import EmpruntSerializer
from ...services import EmpruntService
from ...responses import Responses

class EmpruntView(APIView):
    def get_permissions(self):
        return [IsAuthenticated()] # Tout utilisateur connecté

    @extend_schema(
        summary="Emprunter un livre",
        description="Crée un emprunt pour l'utilisateur connecté via son token JWT.",
        request=EmpruntSerializer,
        responses={201: EmpruntSerializer}
    )
    def post(self, request):
        # recup user_id dans token JWT
        data = request.data.copy()
        data['id_utilisateur'] = request.user.id_utilisateur
        
        serializer = EmpruntSerializer(data=data)
        if not serializer.is_valid():
            raise AllParametersAreRequiredException()

        emprunt = EmpruntService.creer_emprunt(serializer.validated_data)
        if emprunt is None:
            raise NotFoundException("Aucun livre disponible")
        
        return Responses.StandardResponse("success", "Livre emprunté avec succès", EmpruntSerializer(emprunt).data, status.HTTP_201_CREATED)
    
    @extend_schema(
        summary="Liste des emprunts personnels",
        description="Récupère tous les emprunts actifs de l'utilisateur connecté (JWT)",
        responses={200: EmpruntSerializer(many=True)}
    )
    def get(self, request):
        user_id = request.user.id_utilisateur
        emprunts = EmpruntService.get_emprunts_utilisateur(user_id)
        serializer = EmpruntSerializer(emprunts, many=True)
        
        return Responses.StandardResponse(
            "success", 
            "OK", 
            serializer.data, 
            status.HTTP_200_OK
        )
        

        

