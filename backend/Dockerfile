FROM node:22-alpine

WORKDIR /app

# Installation des dépendances système nécessaires pour Prisma
RUN apk add --no-cache openssl openssl-dev curl libc6-compat

COPY package*.json ./
RUN npm install

COPY . .

# Régénération du client Prisma pour s'assurer qu'il correspond à l'environnement
RUN npx prisma generate

EXPOSE 3001
CMD ["node", "src/app.js"]
