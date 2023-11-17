import { Transaction } from 'sequelize';

export interface GetUsersByIdsInterface {
  ids: Array<string>;
  attributes: Array<string>;
  trx?: Transaction;
}
