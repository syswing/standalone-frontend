FROM node:lts-alpine

WORKDIR ~/standalone-frontend/

COPY . .

RUN npm install

RUN npm run build

RUN npm install -g serve

EXPOSE 6666

CMD ["serve", "-s" ,"build","-p","6666"]
