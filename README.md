<h1 align="center">
    MNEMOSYNE
</h1>

## How to run the project

### Requirements

- Node.js - v18.15.0
- Docker - Docker version 24.0.2, build cb74dfc
- Docker Compose - v2.18.1

### Steps

1. Go to [mnemosyne-api](mnemosyne-web-interface/mnemosyne-api) and run `npm i`
2. Go to [mnemosyne-api-proxy](mnemosyne-web-interface/mnemosyne-api-proxy) and run `npm i`
3. Go to [mnemosyne-front](mnemosyne-web-interface/mnemosyne-front) and run `npm i`
4. Put `.env.development` into [mnemosyne-web-interface](mnemosyne-web-interface)
5. From the root folder (**in 2 terminal windows**) run `npm run api:dev` and `npm run api:front`
