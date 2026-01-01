from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from ..serializers import LoginInputSerializer
from ..exceptions import AllParametersAreRequiredException
from ..responses import Responses
from ..services import AuthService

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginInputSerializer(data=request.data)
        if not serializer.is_valid():
            raise AllParametersAreRequiredException("Les paramètres (mail, mdp) sont requis")
        email = request.data.get('mail')
        mdp = request.data.get('mdp')
        user = AuthService.authenticate_user(email, mdp)
        return Responses.StandardResponse("success", "Connexion réussie", user, status.HTTP_200_OK)
