import { Transaction } from 'sequelize';

export interface GetCompanyByNameInterface {
  companyName: string;
  trx?: Transaction;
}
