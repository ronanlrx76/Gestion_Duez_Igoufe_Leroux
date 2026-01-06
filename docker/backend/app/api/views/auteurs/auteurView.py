from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from ...exceptions import AllParametersAreRequiredException
from ...responses import Responses
from ...serializers import AuteurSerializer
from ...services import AuthorService
from ...config import IsAdminUserRole # Ta nouvelle permission

class AuteurView(APIView):
    # permissions 
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()] # Tout utilisateur connecté
        return [IsAuthenticated(), IsAdminUserRole()] # Admin seulement pour le reste
    
    # GET : Lister les auteurs
    @extend_schema(
        summary="Lister les auteurs",
        responses={
            200: AuteurSerializer
        }
    )
    def get(self, request):
        auteurs = AuthorService.get_all_auteurs()
        serializer = AuteurSerializer(auteurs, many=True)
        return Responses.StandardResponse("succes", "OK", serializer.data, status.HTTP_200_OK)

    # POST : Ajouter un auteur
    @extend_schema(
        summary="Créer un auteur => Admin",
        request=AuteurSerializer,
        responses={
            201: AuteurSerializer
        }
    )
    def post(self, request):
        serializer = AuteurSerializer(data=request.data)
        if not serializer.is_valid():
            raise AllParametersAreRequiredException("Les paramètres (nom, prenom) sont requis")
        auteur = AuthorService.create_auteur(serializer.validated_data)
        return Responses.StandardResponse("success", "Auteur créé", AuteurSerializer(auteur).data, status.HTTP_201_CREATED)
