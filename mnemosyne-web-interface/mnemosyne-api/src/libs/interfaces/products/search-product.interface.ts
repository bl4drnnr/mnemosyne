import { Transaction } from 'sequelize';

export interface SearchProductInterface {
  query: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  trx?: Transaction;
}
