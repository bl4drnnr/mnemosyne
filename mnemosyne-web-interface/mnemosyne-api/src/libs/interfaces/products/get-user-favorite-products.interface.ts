import { Transaction } from 'sequelize';

export interface GetUserFavoriteProductsInterface {
  query: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  userId: string;
  trx?: Transaction;
}
