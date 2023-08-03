import { Transaction } from 'sequelize';

export interface GetUserInfoInterface {
  userId: string;
  trx?: Transaction;
}
