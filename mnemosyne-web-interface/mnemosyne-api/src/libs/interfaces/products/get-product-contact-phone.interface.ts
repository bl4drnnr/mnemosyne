import { Transaction } from 'sequelize';

export interface GetProductContactPhoneInterface {
  productId: string;
  trx?: Transaction;
}
