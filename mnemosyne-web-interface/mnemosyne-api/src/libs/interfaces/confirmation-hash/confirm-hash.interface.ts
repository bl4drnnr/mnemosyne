import { Transaction } from 'sequelize';

export interface ConfirmHashInterface {
  hashId: string;
  trx?: Transaction;
}
