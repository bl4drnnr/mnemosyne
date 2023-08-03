import { Transaction } from 'sequelize';

export interface LastPassResetHashInterface {
  userId: string;
  trx?: Transaction;
}
