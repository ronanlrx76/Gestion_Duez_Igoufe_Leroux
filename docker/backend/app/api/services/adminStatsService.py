from django.db.models import Count, Q
from ..models import Emprunt, Livre, ExemplaireLivres
from django.utils import timezone

from django.db.models import Count
from ..models import Emprunt, Livre, ExemplaireLivres
from ..serializers import EmpruntSerializer 
from django.utils import timezone

class AdminStatsService:
    @staticmethod
    def get_dashboard_stats():
        today = timezone.now().date()
        
        # Récupération des données brutes
        emprunts_actifs_qs = Emprunt.objects.all()
        retards_qs = Emprunt.objects.filter(retour_prevu__lt=today)
        liste_stock = Livre.objects.annotate(
            total_exemplaires=Count('exemplairelivres'),
            disponibles=Count(
                'exemplairelivres', 
                filter=Q(exemplairelivres__statut='disponible')
            )
        ).values('id_livre', 'titre', 'total_exemplaires', 'disponibles')
        
        return {
            "emprunts_actifs": {
                "count": emprunts_actifs_qs.count(),
                "data": EmpruntSerializer(emprunts_actifs_qs, many=True).data
            },
            "retards": {
                "count": retards_qs.count(),
                "data": EmpruntSerializer(retards_qs, many=True).data
            },
            "stock": {
                "general": {
                    "total_livres_differents": Livre.objects.count(),
                    "total_exemplaires_physiques": ExemplaireLivres.objects.count()
                },
                "details": list(liste_stock) 
            },
            "popularite": {
                "top_5": Livre.objects.annotate(
                    nb_total=Count('exemplairelivres__historiqueemprunt')
                ).order_by('-nb_total')[:5].values('titre', 'nb_total')
            }
        }
