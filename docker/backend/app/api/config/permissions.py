# api/permissions.py
from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Permet l'accès uniquement aux utilisateurs ayant le rôle 'admin'.
    """
    def has_permission(self, request, view):
        # 1. Vérifier si l'utilisateur est authentifié
        # (request.user a été rempli par ton SafeJWTAuthentication)
        if not request.user:
            return False
        
        # 2. Vérifier le rôle
        # Selon ta structure, on va chercher le libellé du rôle
        # Si request.user est un Identifiant, on passe par id_user
        try:
            # Adapte ce chemin selon si request.user est Utilisateur ou Identifiant
            user_obj = getattr(request.user, 'id_user', request.user)
            return user_obj.id_role.libelle_role.lower() == 'administrateur'
        except AttributeError:
            return False
