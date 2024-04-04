import { Transaction } from 'sequelize';

export interface GetProductBySlugInterface {
  slug: string;
  userId: string | undefined;
  trx?: Transaction;
}
