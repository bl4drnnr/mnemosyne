import { Transaction } from 'sequelize';

export interface GetCompanyProductsStatsInterface {
  companyId: string;
  trx?: Transaction;
}
