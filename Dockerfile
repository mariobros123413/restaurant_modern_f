# Use an official Node.js runtime as the base image
FROM node:alpine as builder

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar los archivos del proyecto al directorio de trabajo
COPY . .

# Instalar las dependencias del proyecto
RUN npm install

# Construir la aplicación React
RUN npm run build

# -------------------------------

# Configurar una imagen ligera de Nginx para servir la aplicación React
FROM nginx:alpine

ADD ./config/default.conf /etc/nginx/conf.d/default.conf
# Copiar la construcción de la aplicación React desde el contenedor del constructor al directorio de trabajo de Nginx
COPY --from=builder /app/build /var/www/app/

# Exponer el puerto 80 para que la aplicación sea accesible desde fuera del contenedor
EXPOSE 80

# Iniciar Nginx en el primer plano
CMD ["nginx", "-g", "daemon off;"]
