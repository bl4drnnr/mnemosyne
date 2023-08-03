import { Transaction } from 'sequelize';

export interface UpdateRefreshTokenInterface {
  userId: string;
  tokenId: string;
  trx?: Transaction;
}
