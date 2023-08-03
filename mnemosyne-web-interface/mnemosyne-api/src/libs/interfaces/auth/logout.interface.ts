import { Transaction } from 'sequelize';

export interface LogoutInterface {
  userId: string;
  trx?: Transaction;
}
