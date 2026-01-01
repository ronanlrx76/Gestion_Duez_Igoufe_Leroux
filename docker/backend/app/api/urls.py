from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register')
]

"""
    path('books/add/', AjouterLivreView.as_view(), name='ajouter_livre'),
    path('books/<int:id_livre>/patch/', ModifierLivreView.as_view(), name='modifier_livre'),
    path('books/<int:id_livre>/delete/', SupprimerLivreView.as_view(), name='supprimer_livre'),
    path('books/list/', ListeLivresView.as_view(), name='lister_livre'),
    path('books/search/', RechercheLivreView.as_view(), name='rechercher_livre'),
    path('', RootView.as_view(), name='root')
"""
