-- Script de création de la base de données pour les utilisateurs
-- Compatible SQLite / MySQL (adapter légèrement si besoin)

-- Création de la base (MySQL uniquement, pas nécessaire pour SQLite)
CREATE DATABASE IF NOT EXISTS club_app;
USE club_app;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,   -- identifiant unique
    first_name VARCHAR(100) NOT NULL,       -- prénom
    last_name VARCHAR(100) NOT NULL,        -- nom
    email VARCHAR(255) NOT NULL UNIQUE,     -- adresse e-mail unique
    password_hash VARCHAR(255) NOT NULL,    -- mot de passe haché
    role VARCHAR(50),                       -- rôle (membre, admin, etc.)
    newsletter BOOLEAN DEFAULT 0,           -- inscription newsletter
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- date de création
);

-- Exemple d’index pour accélérer les recherches par e-mail
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Exemple d’insertion (pour tester)
-- ATTENTION : le mot de passe doit être haché côté serveur (bcrypt/argon2)
INSERT INTO users (first_name, last_name, email, password_hash, role, newsletter)
VALUES ('Demo', 'User', 'demo@club.com', '$2b$12$HASHEDPASSWORD', 'membre', 1);
