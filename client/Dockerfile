# Etapa 1: build
FROM node:18 AS builder

WORKDIR /app/Client

# Copiar solo package.json, lockfile y tsconfig desde FULLSTACK_API/Client
COPY package*.json tsconfig*.json ./

RUN npm install

# Copiar todo el código fuente desde FULLSTACK_API/Client
COPY . .

# Construir la app (ajusta según tu script de build)
RUN npm run build


# Etapa 2: producción con nginx
FROM nginx:stable-alpine

# Copiar los archivos build al nginx
COPY --from=builder /app/Client/dist /usr/share/nginx/html

# Copiar configuración nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
