from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import Utilisateur

class SafeJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        try:
            return Utilisateur.objects.get(id_utilisateur=user_id)
        except Utilisateur.DoesNotExist:
            return None
