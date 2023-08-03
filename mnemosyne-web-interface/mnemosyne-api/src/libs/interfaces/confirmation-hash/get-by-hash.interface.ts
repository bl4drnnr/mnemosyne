import { Transaction } from 'sequelize';

export interface GetByHashInterface {
  confirmationHash: string;
  trx?: Transaction;
}
