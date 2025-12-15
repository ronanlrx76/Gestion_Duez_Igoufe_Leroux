from django.db import models

# 1. Livre
class Livre(models.Model):
    id_livre = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=50)
    auteur = models.CharField(max_length=150)
    emplacement_image_couverture = models.CharField(max_length=100, unique=True, null=True, blank=True)

    class Meta: 
        managed = False 
        db_table = 'livre'


# 2. Exemplaire
class Exemplaire(models.Model):
    id_exemplaire = models.AutoField(primary_key=True)

    class Meta: 
        managed = False 
        db_table = 'exemplaire'


# 3. Role
class Role(models.Model):
    id_role = models.AutoField(primary_key=True)
    libelle_role = models.CharField(max_length=100)
    emprunt_max = models.PositiveSmallIntegerField()

    class Meta: 
        managed = False 
        db_table = 'Role'


# 4. Utilisateur
class Utilisateur(models.Model):
    id_utilisateur = models.BigAutoField(primary_key=True, auto_created=True)
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    date_naissance = models.DateField()
    role = models.ForeignKey(Role, on_delete=models.CASCADE, db_column='id_role')

    class Meta: 
        managed = False 
        db_table = 'utilisateur'


# 5. Identifiant
class Identifiant(models.Model):
    id = models.IntegerField(primary_key=True, auto_created=True)
    password_hash = models.CharField(max_length=100)
    mail = models.EmailField(max_length=60, unique=True)
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, db_column='id_utilisateur')

    class Meta: 
        managed = False 
        db_table = 'identifiant'


# 6. Historique Emprunt
class HistoriqueEmprunt(models.Model):
    date_emprunt = models.DateField()
    retour_prevu = models.DateField()
    date_retour_effectif = models.DateField()
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    exemplaire = models.ForeignKey(Exemplaire, on_delete=models.CASCADE)

    class Meta: 
        managed = False 
        db_table = 'historiqueEmprunt'


# 7. ExemplaireLivres
class ExemplaireLivres(models.Model):
    id_livre = models.ForeignKey(
        'Livre', 
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='id_livre'
    )
    id_exemplaire = models.ForeignKey(
        'Exemplaire', 
        on_delete=models.CASCADE,
        db_column='id_exemplaire'
    )
    statut = models.CharField(max_length=50)
    etat = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'exemplaire_livres'
        managed = False
        unique_together = (('id_livre', 'id_exemplaire'),)


# 8. Emprunt (PrÃªt en cours)
class Emprunt(models.Model):
    exemplaire = models.OneToOneField(Exemplaire, on_delete=models.CASCADE)
    date_emprunt = models.DateField()
    retour_prevu = models.DateField()
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)

    class Meta: 
        managed = False 
        db_table = 'emprunt'
