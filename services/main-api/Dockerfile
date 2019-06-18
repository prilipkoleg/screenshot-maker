FROM node:10.15.3-slim

ARG EXPOSE=80
ENV EXPOSE_PORT $EXPOSE
EXPOSE $EXPOSE_PORT

RUN apt-get update && apt-get install -yq build-essential

WORKDIR /App

COPY package*.json ./

ARG CACHEBUST=1

RUN npm install -g pm2
RUN npm install

COPY . .

CMD ["node", "./bin/www"]
