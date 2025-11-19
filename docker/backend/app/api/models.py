from django.db import models

class Compte(models.Model):
    email = models.CharField(max_length=255, unique=True)
    mdp = models.CharField(max_length=255)

    class Meta:
        managed = False        # Django ne touche pas à la table
        db_table = 'compte'
