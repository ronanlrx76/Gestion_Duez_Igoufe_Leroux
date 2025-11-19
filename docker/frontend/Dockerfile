#   utilisation image Node en version 16 etape de build
FROM node:20-alpine AS build_stage

#   Création du répertoire de travail
WORKDIR /frontend 

#   Copie du fichier package.json
COPY ./package*.json ./

#   Installation des dependances
RUN npm install

#   Copie de l'application
COPY . .

# Compilation de l'appli
RUN npm run build

# Utilisation de nginx pour servir les fichier
FROM nginx:alpine AS prod_stage

COPY --from=build_stage /frontend/dist /usr/share/nginx/html