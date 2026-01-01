from django.db import models
from .exemplaireLivresModel import ExemplaireLivres
from .utilisateurModel import Utilisateur

class HistoriqueEmprunt(models.Model):
    id_historique = models.AutoField(primary_key=True)
    date_emprunt = models.DateField()
    retour_prevu = models.DateField()
    date_retour_effectif = models.DateField()
    id_utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, db_column='id_utilisateur')
    id_exemplaire = models.ForeignKey(ExemplaireLivres, on_delete=models.CASCADE, db_column='id_exemplaire')

    class Meta:
        managed = False
        db_table = 'Historique_emprunt'
