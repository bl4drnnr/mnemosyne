import { Transaction } from 'sequelize';

export interface GetProductBySlugToEditInterface {
  userId: string;
  slug: string;
  trx?: Transaction;
}
