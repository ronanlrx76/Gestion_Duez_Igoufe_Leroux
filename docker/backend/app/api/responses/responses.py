from rest_framework.response import Response
class Responses:
    @staticmethod
    def StandardResponse(status_name, message="", data=None, http_status=200):
        """
        Génère une réponse unifiée pour toute l'API.
        status_name: 'success' ou 'error'
        """
        return Response({
            "status": status_name,
            "message": message,
            "data": data if data is not None else []
        }, status=http_status)
