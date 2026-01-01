from rest_framework.views import exception_handler
from ..responses import Responses
from rest_framework import status

def CustomExceptionHandler(exc, context):
    # Appelle le handler par défaut de DRF pour obtenir l'erreur standard
    response = exception_handler(exc, context)

    if response is not None:
        # On reformate la réponse pour qu'elle corresponde à ton format unifié
        return Responses.StandardResponse(
            status_name="error",
            message=str(exc.detail) if hasattr(exc, 'detail') else "Une erreur est survenue",
            data=None,
            http_status=response.status_code
        )

    return Responses.StandardResponse(
        status_name="error",
        message="Une erreur serveur imprévue est survenue.",
        data=str(exc),
        http_status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
