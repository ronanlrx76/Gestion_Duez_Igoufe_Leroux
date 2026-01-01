CREATE DATABASE IF NOT EXISTS biblio;
USE biblio;

-- 1. Création de la table Auteur (Nouvelle table)
CREATE TABLE IF NOT EXISTS Auteur (
    id_auteur INT(11) AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100)
);

-- 2. Création de la table Livre (Modifiée avec FK Auteur)
CREATE TABLE IF NOT EXISTS Livre (
    id_livre INT(11) AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    id_auteur INT(11) NOT NULL,
    emplacement_image_couverture VARCHAR(255) UNIQUE,
    CONSTRAINT fk_livre_auteur FOREIGN KEY (id_auteur) REFERENCES Auteur(id_auteur)
);

-- 3. Création de la table Role
CREATE TABLE IF NOT EXISTS Role (
    id_role INT(11) PRIMARY KEY,
    libelle_role VARCHAR(100) NOT NULL,
    emprunt_max TINYINT(4) NOT NULL
);

-- 4. Création de la table Utilisateur
CREATE TABLE IF NOT EXISTS Utilisateur (
    id_utilisateur INT(11) AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    date_naissance DATE NOT NULL,
    id_role INT(11) NOT NULL,
    CONSTRAINT fk_utilisateur_role FOREIGN KEY (id_role) REFERENCES Role(id_role)
);

-- 5. Création de la table Identifiant
CREATE TABLE IF NOT EXISTS Identifiant (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    mail VARCHAR(100) NOT NULL UNIQUE,
    id_utilisateur INT(11) NOT NULL UNIQUE,
    CONSTRAINT fk_identifiant_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
);

-- 6. Création de la table Exemplaire_livres (Remplace l'ancienne table Exemplaire)
CREATE TABLE IF NOT EXISTS Exemplaire_livres (
    id_exemplaire INT(11) AUTO_INCREMENT PRIMARY KEY,
    id_livre INT(11) NOT NULL,
    statut VARCHAR(50) NOT NULL,
    etat VARCHAR(50),
    CONSTRAINT fk_exemplaire_livre FOREIGN KEY (id_livre) REFERENCES Livre(id_livre)
);

-- 7. Création de la table Emprunt (Emprunts en cours)
CREATE TABLE IF NOT EXISTS Emprunt (
    id_exemplaire INT(11) PRIMARY KEY,
    date_emprunt DATE NOT NULL,
    retour_prevu DATE NOT NULL,
    id_utilisateur INT(11) NOT NULL,
    CONSTRAINT fk_emprunt_exemplaire FOREIGN KEY (id_exemplaire) REFERENCES Exemplaire_livres(id_exemplaire),
    CONSTRAINT fk_emprunt_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
);

-- 8. Création de la table Historique_emprunt
CREATE TABLE IF NOT EXISTS Historique_emprunt (
    id_historique INT(11) AUTO_INCREMENT PRIMARY KEY,
    date_emprunt DATE NOT NULL,
    retour_prevu DATE NOT NULL,
    date_retour_effectif DATE NOT NULL,
    id_utilisateur INT(11) NOT NULL,
    id_exemplaire INT(11) NOT NULL,
    CONSTRAINT fk_hist_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    CONSTRAINT fk_hist_exemplaire FOREIGN KEY (id_exemplaire) REFERENCES Exemplaire_livres(id_exemplaire)
);
