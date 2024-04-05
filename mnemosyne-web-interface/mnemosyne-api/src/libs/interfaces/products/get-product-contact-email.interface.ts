import { Transaction } from 'sequelize';

export interface GetProductContactEmailInterface {
  productId: string;
  trx?: Transaction;
}
