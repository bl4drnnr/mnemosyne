import { Transaction } from 'sequelize';

export interface ClearSmsInterface {
  userId: string;
  trx?: Transaction;
}
