from django.urls import path
from drf_spectacular.views import SpectacularSwaggerView, SpectacularAPIView
from .views import *

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),

    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),

    path('authors/', AuteurView.as_view(), name='get/post auteur'),
    path('authors/<int:id>/', AuteurDetailView.as_view(), name='delete livre'),

    path('books/', LivreView.as_view(), name='get/post livre'),
    path('books/<int:id>/', LivreDetailView.as_view(), name='delete livre'),

    path('exemplaires/', ExemplaireLivreView.as_view(), name='get/post exemplaires livre'),
    path('exemplaires/<int:id>/', ExemplaireLivreDetailView.as_view(), name='patch exemplaires livre'),

    path('emprunts/', EmpruntView.as_view(), name='get/post emprunt'),
    path('emprunts/<int:id>/', EmpruntDetailView.as_view(), name='delete emprunt'),

    path('historique-emprunts/', HistoriqueEmpruntView.as_view(), name='get historique'),

    path('admin/dashboard/', AdminDashboardView.as_view(), name='get dashboard')
]

"""
rajouter patch et delete sur les <int:id>
"""
