FROM nginx:stable-alpine

COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY .nuxt/dist /usr/share/nginx/html/
