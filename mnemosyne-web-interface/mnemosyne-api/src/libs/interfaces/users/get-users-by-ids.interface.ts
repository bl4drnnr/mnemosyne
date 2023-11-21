import { Transaction } from 'sequelize';

export interface GetUsersByIdsInterface {
  page: number;
  limit: number;
  ids: Array<string>;
  attributes: Array<string>;
  trx?: Transaction;
}
