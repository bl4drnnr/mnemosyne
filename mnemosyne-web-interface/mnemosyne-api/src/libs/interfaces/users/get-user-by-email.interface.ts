import { Transaction } from 'sequelize';

export interface GetUserByEmailInterface {
  email: string;
  trx?: Transaction;
}
