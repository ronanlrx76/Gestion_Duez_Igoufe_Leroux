from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes

from ...serializers import LoginInputSerializer, UserProfileSerializer
from ...exceptions import AllParametersAreRequiredException, InvalidEmailOrPasswordException
from ...responses import Responses
from ...services import AuthService

class LoginView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(
        summary="Login",
        request=LoginInputSerializer,
        description="Renvoie le user et ces tokens (à stocker dans localStorage) => access_token dans toutes les Authorization Bearer de chaque requêtes à l'api",
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT  
        }
    )
    def post(self, request):
        serializerInput = LoginInputSerializer(data=request.data)
        if not serializerInput.is_valid():
            raise AllParametersAreRequiredException("Les paramètres (mail, mdp) sont requis")
        
        email = request.data.get('mail')
        mdp = request.data.get('mdp')
        user = AuthService.authenticate_user(email, mdp)
        if user is None:
             raise InvalidEmailOrPasswordException()
        
        tokens = AuthService.generate_tokens(user)
        serializerOutput = UserProfileSerializer(user)
        response_data = {
            "user": serializerOutput.data,
            "tokens": tokens
        }
        return Responses.StandardResponse("success", "Connexion réussie", response_data, status.HTTP_200_OK)
