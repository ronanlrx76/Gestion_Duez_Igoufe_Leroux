from django.db import models
from .utilisateurModel import Utilisateur

class Identifiant(models.Model):
    id = models.AutoField(primary_key=True)
    password_hash = models.CharField(max_length=255)
    mail = models.EmailField(max_length=100, unique=True)
    # OneToOne car id_utilisateur est UNIQUE dans ton SQL
    id_utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, db_column='id_utilisateur', related_name='identifiant')

    class Meta:
        managed = False
        db_table = 'Identifiant'
