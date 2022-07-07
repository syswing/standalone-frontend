FROM nginx

WORKDIR ~/standalone-frontend/

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./build/  /usr/share/nginx/html/

EXPOSE 6666
