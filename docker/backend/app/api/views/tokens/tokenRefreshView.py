from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import status

from ...responses import Responses

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            # Tente de valider le refresh token
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            # Si le refresh est expiré ou invalide
            return Responses.StandardResponse(
                "error", 
                "Le refresh token est invalide ou expiré. Veuillez vous reconnecter.", 
                None, 
                status.HTTP_401_UNAUTHORIZED
            )

        # Si tout est bon, on récupère le nouveau access token
        return Responses.StandardResponse(
            "success", 
            "Token rafraîchi avec succès", 
            serializer.validated_data, # Contient {'access': '...', 'refresh': '...'} si rotation activée
            status.HTTP_200_OK
        )
