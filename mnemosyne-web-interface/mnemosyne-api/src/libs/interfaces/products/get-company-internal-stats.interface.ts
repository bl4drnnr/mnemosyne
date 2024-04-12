import { Transaction } from 'sequelize';

export interface GetCompanyInternalStatsInterface {
  companyId: string;
  userId: string;
  query: string;
  trx?: Transaction;
}
