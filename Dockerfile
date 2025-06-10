# Etapa de construcción
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar package.json y yarn.lock
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Set NODE_ENV to production
ENV NODE_ENV=production

# Instalar dependencias
RUN yarn install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN yarn build

# Etapa de producción
FROM node:22-alpine

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Instalar dependencias de producción
COPY package*.json ./
RUN yarn install --production

# Copiar el código construido desde la etapa de builder
COPY --from=builder /app/dist ./dist

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["yarn", "start:prod"]
