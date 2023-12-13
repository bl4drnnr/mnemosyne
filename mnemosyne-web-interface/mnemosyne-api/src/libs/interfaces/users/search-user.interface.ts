import { Transaction } from 'sequelize';

export interface SearchUserInterface {
  query: string;
  attributes?: Array<string>;
  trx?: Transaction;
}
