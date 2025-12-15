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
        id_role = request.data.get("id_role")

        if mdp is None or mail is None or nom is None or prenom is None or date_naissance is None or id_role is None:
            return Response(
                {"error": "all params is required (mdp, mail, nom, prenom, date_naissance, id_role )"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Identifiant.objects.filter(mail=mail).exists():
            return Response({"error": "Mail déjà utilisé"}, status=400)

        from django.shortcuts import get_object_or_404

        role = get_object_or_404(Role, id_role=id_role)


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
            "user_id": user.id_utilisateur,
            "id": identifiant.id
        }, status=201)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('mail')
        mdp = request.data.get('mdp')
        
        try:
            user = Identifiant.objects.get(mail=email)
        except Identifiant.DoesNotExist:
            return Response({"error": "Identifiant non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        if check_password(mdp, user.password_hash):
            return Response({"success": True, "email": user.mail})
        else:
            return Response({"error": "Mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)
        
# LIVRES

class RechercheLivreView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        query = request.GET.get("q", "")

        livres = ExemplaireLivres.objects.filter(
            statut="disponible",
            livre__titre__icontains=query
        ) | ExemplaireLivres.objects.filter(
            statut="disponible",
            livre__auteur__icontains=query
        )

        resultats = []
        for el in livres.select_related("livre"):
            resultats.append({
                "id_livre": el.id_livre.id_livre,
                "titre": el.id_livre.titre,
                "auteur": el.id_livre.auteur,
                "etat": el.etat,
                "statut": el.statut
            })

        return Response(resultats)

class AjouterLivreView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        titre = request.data.get("titre")
        auteur = request.data.get("auteur")

        livre = Livre.objects.create(
            titre=titre,
            auteur=auteur
        )

        exemplaire = Exemplaire.objects.create()

        ExemplaireLivres.objects.create(
            id_livre=livre,
            id_exemplaire=exemplaire,
            statut="disponible"
        )

        return Response({"success": True, "id_livre": livre.id_livre}, status=201)

class ModifierLivreView(APIView):
    permission_classes = [AllowAny]
    def put(self, request, id_livre):
        livre = Livre.objects.get(id=id_livre)

        livre.titre = request.data.get("titre", livre.titre)
        livre.auteur = request.data.get("auteur", livre.auteur)
        livre.save()

        return Response({"success": True})

class SupprimerLivreView(APIView):
    permission_classes = [AllowAny]
    def delete(self, request, id_livre):
        livre = Livre.objects.get(id=id_livre)
        livre.delete()

        return Response({"success": True})

class ListeLivresView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        livres = ExemplaireLivres.objects.select_related("id_livre")

        data = []
        for el in livres:
            data.append({
                "id_livre": el.id_livre.id_livre,
                "titre": el.id_livre.titre,
                "auteur": el.id_livre.auteur,
                "statut": el.statut,
                "etat": el.etat
            })

        return Response(data)



class RootView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({"API-bibliotheque": "Bienvenue"})
