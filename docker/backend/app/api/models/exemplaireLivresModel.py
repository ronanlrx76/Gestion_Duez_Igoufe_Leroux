from django.db import models
from .livreModel import Livre

class ExemplaireLivres(models.Model):
    id_exemplaire = models.AutoField(primary_key=True)
    id_livre = models.ForeignKey(Livre, on_delete=models.CASCADE, db_column='id_livre', related_name='exemplaires')
    statut = models.CharField(max_length=50)
    etat = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Exemplaire_livres'
