import { Transaction } from 'sequelize';

export interface GetCompanyByUserIdInterface {
  userId: string;
  trx?: Transaction;
}
