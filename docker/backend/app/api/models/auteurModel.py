from django.db import models

class Auteur(models.Model):
    id_auteur = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Auteur'
