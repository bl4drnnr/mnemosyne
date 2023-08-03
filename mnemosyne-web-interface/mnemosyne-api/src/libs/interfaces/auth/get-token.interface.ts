import { Transaction } from 'sequelize';

export interface GetTokenInterface {
  tokenId: string;
  trx?: Transaction;
}
