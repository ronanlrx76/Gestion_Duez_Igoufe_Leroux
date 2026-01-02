from django.contrib.auth.hashers import make_password, check_password
from ..models import Utilisateur, Identifiant
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken

class AuthService:
    @staticmethod
    def generate_tokens(user):
        """Génère un Access et un Refresh token pour un utilisateur."""
        refresh = RefreshToken()
        
        # On injecte l'ID de ton utilisateur directement dedans
        refresh['user_id'] = user.id_utilisateur
        
        # Optionnel : tu peux même ajouter le nom pour que le Front 
        # puisse le lire sans décoder tout le profil
        refresh['nom'] = user.nom
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
    @staticmethod
    @transaction.atomic
    def register_user(nom, prenom, email, password, date_naissance, id_role):
        if Identifiant.objects.filter(mail=email).exists():
            return None
        
        # 1. Création du profil utilisateur
        user_profile = Utilisateur.objects.create(
            nom=nom,
            prenom=prenom,
            date_naissance=date_naissance,
            id_role_id=id_role
        )
        
        # 2. Création des identifiants (hachage du mot de passe)
        Identifiant.objects.create(
            mail=email,
            password_hash=make_password(password),
            id_utilisateur=user_profile
        )
        return user_profile

    @staticmethod
    def authenticate_user(email, password):
        identifiant = Identifiant.objects.select_related('id_utilisateur', 'id_utilisateur__id_role').filter(mail=email).first()
        if not identifiant or not check_password(password, identifiant.password_hash):
           return None
        return identifiant.id_utilisateur
