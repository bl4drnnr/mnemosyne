FROM node:18.10.0

WORKDIR /usr/src/mnemosyne-api

RUN npm i -g nest
RUN npm i -g @nestjs/cli

COPY ../../mnemosyne-api/package*.json ./

RUN npm install

COPY ../../mnemosyne-api/ .

RUN npm run build
