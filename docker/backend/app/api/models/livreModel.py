from django.db import models
from .auteurModel import Auteur

class Livre(models.Model):
    id_livre = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=150)
    # Relation vers Auteur
    id_auteur = models.ForeignKey(Auteur, on_delete=models.CASCADE, db_column='id_auteur')
    emplacement_image_couverture = models.CharField(max_length=255, unique=True, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Livre'
