import { Transaction } from 'sequelize';

export interface GetProductBySlugInterface {
  slug: string;
  trx?: Transaction;
}
