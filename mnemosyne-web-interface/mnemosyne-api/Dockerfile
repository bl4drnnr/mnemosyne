FROM node:18.10.0

WORKDIR /usr/src/mnemosyne-api

RUN npm i -g nest
RUN npm i -g @nestjs/cli

COPY package*.json ./

RUN npm install --force --no-workspaces

COPY . .

RUN npm run build
