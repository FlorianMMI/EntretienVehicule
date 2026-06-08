# Utiliser l'image Node officielle
FROM node:lts-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port de l'API
EXPOSE 3000

# Démarrer avec nodemon pour le rechargement automatique
CMD ["npm", "run", "dev"]