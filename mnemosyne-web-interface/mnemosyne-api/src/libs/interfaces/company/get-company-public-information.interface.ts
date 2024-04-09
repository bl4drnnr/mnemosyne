import { Transaction } from 'sequelize';

export interface GetCompanyPublicInformationInterface {
  companyId: string;
  page: string;
  pageSize: string;
  query: string;
  trx?: Transaction;
}
