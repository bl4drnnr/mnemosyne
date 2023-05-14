// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`)
});

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.POSTGRES_POST_LOCAL,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE
  }
};
