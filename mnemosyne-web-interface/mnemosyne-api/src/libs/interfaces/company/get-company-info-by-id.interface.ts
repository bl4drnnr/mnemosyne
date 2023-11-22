import { Transaction } from 'sequelize';

export interface GetCompanyInfoByIdInterface {
  companyId: string;
  page: string;
  pageSize: string;
  trx?: Transaction;
}
