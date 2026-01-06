from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from ...responses import Responses
from ...services import HistoriqueEmpruntService
from ...serializers import HistoriqueEmpruntSerializer

class HistoriqueEmpruntView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Appel au nouveau service
        historique = HistoriqueEmpruntService.get_historique_utilisateur(user.id_utilisateur)
        
        serializer = HistoriqueEmpruntSerializer(historique, many=True)
        return Responses.StandardResponse("success", "Historique récupéré", serializer.data)
