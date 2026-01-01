from django.db import models
from .roleModel import Role

class Utilisateur(models.Model):
    id_utilisateur = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    date_naissance = models.DateField()
    id_role = models.ForeignKey(Role, on_delete=models.CASCADE, db_column='id_role')

    class Meta:
        managed = False
        db_table = 'Utilisateur'
