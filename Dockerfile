FROM nginx

WORKDIR /root/standalone-frontend/

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./build/  /usr/share/nginx/html/

RUN chmod -R 755 /usr/share/nginx/html/

EXPOSE 7777

CMD ["nginx", "-g", "daemon off;"]
