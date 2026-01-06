from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ...responses import Responses

from ...services import AdminStatsService
from ...config import IsAdminUserRole # Ton décorateur de rôle

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        stats = AdminStatsService.get_dashboard_stats()
        return Responses.StandardResponse("success", "Statistiques récupérées", stats)
