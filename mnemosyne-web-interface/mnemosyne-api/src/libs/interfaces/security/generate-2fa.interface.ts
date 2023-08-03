import { Transaction } from 'sequelize';

export interface Generate2faInterface {
  userId: string;
  trx?: Transaction;
}
