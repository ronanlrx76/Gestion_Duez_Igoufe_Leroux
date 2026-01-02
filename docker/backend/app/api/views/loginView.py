from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from ..serializers import LoginInputSerializer, UserProfileSerializer
from ..exceptions import AllParametersAreRequiredException, InvalidEmailOrPasswordException
from ..responses import Responses
from ..services import AuthService

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializerInput = LoginInputSerializer(data=request.data)
        if not serializerInput.is_valid():
            raise AllParametersAreRequiredException("Les paramètres (mail, mdp) sont requis")
        email = request.data.get('mail')
        mdp = request.data.get('mdp')
        user = AuthService.authenticate_user(email, mdp)
        if user is None:
             raise InvalidEmailOrPasswordException()
        serializerOutput = UserProfileSerializer(user)
        return Responses.StandardResponse("success", "Connexion réussie", serializerOutput.data, status.HTTP_200_OK)
