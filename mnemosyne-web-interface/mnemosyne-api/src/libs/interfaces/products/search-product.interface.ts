import { Transaction } from 'sequelize';

export interface SearchProductInterface {
  query: string;
  page: string;
  pageSize: string;
  trx?: Transaction;
}
