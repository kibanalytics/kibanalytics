# build commands
FROM node:16

WORKDIR /app
COPY package*.json ./

RUN npm ci --only=production