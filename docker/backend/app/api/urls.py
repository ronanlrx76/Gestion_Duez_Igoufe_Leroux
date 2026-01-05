from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),

    path('authors/', AuteurView.as_view(), name='get/post auteur'),
    path('authors/<int:id>', AuteurView.as_view(), name='delete livre'),

    path('books/', LivreView.as_view(), name='get/post livre'),
    path('books/<int:id>', LivreView.as_view(), name='delete livre'),

    path('exemplaires/', ExemplaireLivreView.as_view(), name='get/post exemplaires livre'),
    path('exemplaires/<int:id>', ExemplaireLivreView.as_view(), name='patch exemplaires livre'),

    path('emprunts/', EmpruntView.as_view(), name='get/post emprunt'),
]

"""
rajouter patch et delete sur les <int:id>
"""
