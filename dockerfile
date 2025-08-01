# ┌─────────────────────────────────────────────┐
# │ Étape 1 : Build & obfuscation              │
# └─────────────────────────────────────────────┘
FROM node:22-alpine AS builder

# 1. Définir le répertoire de travail
WORKDIR /app

# 2. Copier package.json et package-lock.json pour installer les mêmes dépendances
COPY package*.json ./

# 3. Installer les dépendances en CI mode
RUN npm ci

# 4. Installer Ionic CLI globalement (optionnel si vous appelez directement npm run build)
RUN npm install -g @ionic/cli

# 5. Copier tout le reste du projet
COPY . .

# 6. Compiler en production puis lancer l’obfuscation
#    - ionic build --prod génère /app/www (ou dist/ selon votre config)
#    - npm run obfuscate doit pointer vers ce dossier
RUN ionic build --prod
RUN npm run obfuscate

# ┌─────────────────────────────────────────────┐
# │ Étape 2 : Serveur statique                │
# └─────────────────────────────────────────────┘
FROM nginx:alpine

# Copier les fichiers générés et obfusqués depuis le builder
# Remplacez "my-app" par le nom exact de votre dossier de build
COPY --from=builder /app/www/ /usr/share/nginx/html/

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour lancer Nginx en avant-plan
CMD ["nginx", "-g", "daemon off;"]
