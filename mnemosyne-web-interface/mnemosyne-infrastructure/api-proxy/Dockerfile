FROM node:18.10.0

WORKDIR /usr/src/mnemosyne-api-proxy

RUN npm i -g nest
RUN npm i -g @nestjs/cli

COPY ../../mnemosyne-api-proxy/package*.json ./

RUN npm install

COPY ../../mnemosyne-api-proxy/ .

RUN npm run build
