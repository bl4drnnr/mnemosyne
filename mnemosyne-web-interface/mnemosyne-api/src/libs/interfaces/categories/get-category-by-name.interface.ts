import { Transaction } from 'sequelize';

export interface GetCategoryByNameInterface {
  name: string;
  trx?: Transaction;
}
