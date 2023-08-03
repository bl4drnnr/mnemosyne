import { Transaction } from 'sequelize';

export interface GetUserByIdInterface {
  id: string;
  trx?: Transaction;
}
