from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import status
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes

from ...responses import Responses
from ...serializers import CustomTokenRefreshSerializer

class CustomTokenRefreshView(TokenRefreshView):
    @extend_schema(
        summary="Rafraîchir l'Access Token",
        description="Prend un refresh token et renvoie un nouvel access token valide." \
        "A stocker dans localStorage, le JWT dure 15min, donc a un moment il y a 401 => " \
        "Envoyer a cette route dans le body du POST le refresh token reçu lors du login",
        responses={
            200: OpenApiTypes.OBJECT, # Renvoie {"access": "...", "refresh": "..."}
            401: OpenApiTypes.OBJECT  # Erreur si le refresh est expiré
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = CustomTokenRefreshSerializer

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
            serializer.validated_data, 
            status.HTTP_200_OK
        )
