
FROM node:lts-alpine

WORKDIR ~/standalone-frontend/

COPY . .

RUN npm install

RUN npm run build

FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 6666

CMD ["nginx", "-g", "daemon off;"]
