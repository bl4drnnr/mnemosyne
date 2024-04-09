import { Transaction } from 'sequelize';

export interface GetUsersByIdsInterface {
  limit: number;
  offset: number;
  ids: Array<string>;
  attributes: Array<string>;
  where?: any;
  trx?: Transaction;
}
