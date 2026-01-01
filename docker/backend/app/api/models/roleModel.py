from django.db import models

class Role(models.Model):
    id_role = models.IntegerField(primary_key=True)
    libelle_role = models.CharField(max_length=100)
    emprunt_max = models.IntegerField() # tinyint(4)

    class Meta:
        managed = False
        db_table = 'Role'
