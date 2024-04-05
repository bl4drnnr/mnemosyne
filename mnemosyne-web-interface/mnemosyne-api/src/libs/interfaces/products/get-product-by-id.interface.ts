import { Transaction } from 'sequelize';

export interface GetProductByIdInterface {
  productId: string;
  trx?: Transaction;
}
