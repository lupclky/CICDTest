# Dockerfile to package the static website with NGINX
FROM nginx:alpine
COPY . /usr/share/nginx/html
