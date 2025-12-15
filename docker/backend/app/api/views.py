from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import *
from django.contrib.auth.hashers import make_password, check_password

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        mdp = request.data.get("mdp")
        mail = request.data.get("mail")
        nom = request.data.get("nom")
        prenom = request.data.get("prenom")
        date_naissance = request.data.get("date_naissance")
        role_id = request.data.get("role_id")

        if Identifiant.objects.filter(mail=mail).exists():
            return Response({"error": "Mail déjà utilisé"}, status=400)

        role = Role.objects.get(id_role=role_id)

        # 1. Créer l'utilisateur
        user = Utilisateur.objects.create(
            nom=nom,
            prenom=prenom,
            date_naissance=date_naissance,
            role=role
        )

        # 2. Créer l'identifiant associé
        identifiant = Identifiant.objects.create(
            password_hash=make_password(mdp),
            mail=mail,
            utilisateur=user
        )

        return Response({
            "success": True,
            "user_id": user.id,
            "id": identifiant.id
        }, status=201)


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        mdp = request.data.get('mdp')
        
        try:
            user = Identifiant.objects.get(mail=email)
        except Identifiant.DoesNotExist:
            return Response({"error": "Compte non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        if check_password(mdp, user.password_hash):
            return Response({"success": True, "email": user.mail})
        else:
            return Response({"error": "Mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

class RootView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({"API-bibliotheque": "Bienvenue"})
