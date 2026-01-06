from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes

from ...services.authService import AuthService
from ...serializers import RegisterInputSerializer, UserProfileSerializer
from ...exceptions import AllParametersAreRequiredException, EmailAlreadyExistsException
from ...responses import Responses

class RegisterView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(
        summary="Register",
        request=RegisterInputSerializer,
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT, 
            409: OpenApiTypes.OBJECT
        }
    )
    def post(self, request):
        serializerInput = RegisterInputSerializer(data=request.data)
        if not serializerInput.is_valid():
            raise AllParametersAreRequiredException("Les paramètres (password,email,nom,prenom,date_naissance,id_role) sont requis.")
            
        user = AuthService.register_user(
            nom=request.data.get('nom'),
            prenom=request.data.get('prenom'),
            email=request.data.get('email'),
            password=request.data.get('password'),
            date_naissance=request.data.get('date_naissance'),
            id_role=request.data.get('id_role')
        )

        if user is None:
            raise EmailAlreadyExistsException("Email déjà utilisé.")
        serializerOutput = UserProfileSerializer(user)
        return Responses.StandardResponse("success", "Utilisateur créé", serializerOutput.data, status.HTTP_201_CREATED)

