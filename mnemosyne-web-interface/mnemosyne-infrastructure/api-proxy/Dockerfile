FROM node:18.10.0

WORKDIR /usr/src/mnemosyne-api-proxy

RUN npm i -g nest
RUN npm i -g @nestjs/cli

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build
