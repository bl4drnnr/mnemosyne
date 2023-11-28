import { Transaction } from 'sequelize';

export interface GetCompanyUsersInterface {
  companyId: string;
  page: string;
  pageSize: string;
  trx?: Transaction;
}
