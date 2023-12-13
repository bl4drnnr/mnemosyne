import { Transaction } from 'sequelize';

export interface SearchCompanyMemberInterface {
  companyId: string;
  query: string;
  page: string;
  pageSize: string;
  trx?: Transaction;
}
