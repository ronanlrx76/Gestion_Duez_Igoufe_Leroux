from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import Utilisateur
class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        refresh = RefreshToken(attrs['refresh'])
        user_id = refresh.payload.get('user_id')
        
        # Utilise ton modèle spécifique pour que l'IDE reconnaisse 'id_role'
        try:
            user = Utilisateur.objects.get(id_utilisateur=user_id)
            # Maintenant 'id_role' est reconnu
            refresh['role'] = user.id_role.libelle_role.lower()
        except Utilisateur.DoesNotExist:
            pass
            
        return data
