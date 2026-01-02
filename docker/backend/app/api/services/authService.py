from django.contrib.auth.hashers import make_password, check_password
from ..models import Utilisateur, Identifiant
from django.db import transaction

class AuthService:
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
        identifiant = Identifiant.objects.filter(mail=email).first()
        if not identifiant or not check_password(password, identifiant.password_hash):
           return None
        return identifiant.id_utilisateur
