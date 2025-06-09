# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y yarn.lock
COPY package*.json ./

# Instalar dependencias
RUN yarn install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN yarn build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias de producción
COPY package*.json ./
RUN yarn install --production

# Copiar el código construido desde la etapa de builder
COPY --from=builder /app/dist ./dist

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["yarn", "start:prod"]
