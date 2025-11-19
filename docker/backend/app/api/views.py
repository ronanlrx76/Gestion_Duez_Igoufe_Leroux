from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Compte
from django.contrib.auth.hashers import make_password, check_password

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        mdp = request.data.get('mdp')

        if not email or not mdp:
            return Response({"error": "Email et mot de passe requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        if Compte.objects.filter(email=email).exists():
            return Response({"error": "Email déjà utilisé"}, status=status.HTTP_400_BAD_REQUEST)
        
        mdp_hash = make_password(mdp)

        compte = Compte(email=email, mdp=mdp_hash)
        compte.save()

        return Response({"success": True, "email": compte.email}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        mdp = request.data.get('mdp')
        
        try:
            compte = Compte.objects.get(email=email)
        except Compte.DoesNotExist:
            return Response({"error": "Compte non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        if check_password(mdp, compte.mdp):
            return Response({"success": True, "email": compte.email})
        else:
            return Response({"error": "Mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

class RootView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({"API-bibliotheque": "Bienvenue"})