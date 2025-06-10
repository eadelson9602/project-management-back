# Etapa de construcción
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar package.json y yarn.lock
COPY package.json yarn.lock ./

# Instalar TODAS las dependencias (dev + prod)
RUN yarn install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN yarn build

# Etapa de producción
FROM node:22-alpine

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copiar package.json y yarn.lock
COPY package.json yarn.lock ./

# Instalar solo dependencias de producción
RUN yarn install --production --frozen-lockfile

# Copiar el código construido desde la etapa de builder
COPY --from=builder /app/dist ./dist

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["yarn", "start:prod"]
