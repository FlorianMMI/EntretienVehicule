# Utiliser une image Node officielle
FROM node:lts-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port par défaut de Vite
EXPOSE 5173

# Démarrer l'application en mode développement
CMD ["npm", "run", "dev"]