from django.db import models
from .exemplaireLivresModel import ExemplaireLivres
from .utilisateurModel import Utilisateur

class Emprunt(models.Model):
    id_exemplaire = models.OneToOneField(ExemplaireLivres, primary_key=True, on_delete=models.CASCADE, db_column='id_exemplaire', related_name='emprunts')
    date_emprunt = models.DateField()
    retour_prevu = models.DateField()
    id_utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, db_column='id_utilisateur')

    class Meta:
        managed = False
        db_table = 'Emprunt'
    
