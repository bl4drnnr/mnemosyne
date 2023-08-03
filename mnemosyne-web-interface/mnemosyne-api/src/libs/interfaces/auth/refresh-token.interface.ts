import { Transaction } from 'sequelize';

export interface RefreshTokenInterface {
  refreshToken: string;
  trx?: Transaction;
}
