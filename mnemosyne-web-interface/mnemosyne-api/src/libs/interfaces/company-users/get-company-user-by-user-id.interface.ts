import { Transaction } from 'sequelize';

export interface GetCompanyUserByUserIdInterface {
  userId: string;
  trx?: Transaction;
}
