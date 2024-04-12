import { Transaction } from 'sequelize';

export interface GetCompanyUsersInterface {
  companyId: string;
  page: string;
  pageSize: string;
  query: string;
  trx?: Transaction;
}
