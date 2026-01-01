from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from ..services.authService import AuthService
from ..serializers import RegisterInputSerializer
from ..exceptions import AllParametersAreRequiredException
from ..responses import Responses

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterInputSerializer(data=request.data)
        if not serializer.is_valid():
            raise AllParametersAreRequiredException("Les paramètres (mdp,mail,nom,prenom,date_naissance,id_role) sont requis.")
            
        user = AuthService.register_user(
            nom=request.data.get('nom'),
            prenom=request.data.get('prenom'),
            email=request.data.get('email'),
            password=request.data.get('password'),
            date_naissance=request.data.get('date_naissance'),
            id_role=request.data.get('id_role')
        )
        return Responses.StandardResponse("success", "Utilisateur créé", user, status.HTTP_201_CREATED)

