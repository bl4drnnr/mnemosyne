import { Transaction } from 'sequelize';

export interface GetUserByPhoneInterface {
  phone: string;
  trx?: Transaction;
}
