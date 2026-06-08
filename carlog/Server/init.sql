-- On supprime l'ancienne table si elle existe pour repartir au propre
DROP TABLE IF EXISTS vehicles;

-- Création de la table avec le kilométrage
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    marque VARCHAR(100) NOT NULL,
    modele VARCHAR(100) NOT NULL,
    annee INTEGER NOT NULL,
    kilometrage INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de test avec le kilométrage
INSERT INTO vehicles (marque, modele, annee, kilometrage) VALUES ('Peugeot', '205', 1989, 237000);
