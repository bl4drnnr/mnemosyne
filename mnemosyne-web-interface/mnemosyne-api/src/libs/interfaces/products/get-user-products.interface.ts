import { Transaction } from 'sequelize';

export interface GetUserProductsInterface {
  query: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  userId: string;
  trx?: Transaction;
}
