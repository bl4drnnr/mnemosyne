import { Transaction } from 'sequelize';

export interface DeleteUserAccountInterface {
  userId: string;
  trx?: Transaction;
}
