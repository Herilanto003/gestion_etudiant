FROM node:22-alpine

# Installer les dépendances pour Prisma
RUN apt-get update && \
    apt-get install -y libssl1.1 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001
CMD ["node", "src/app.js"]
