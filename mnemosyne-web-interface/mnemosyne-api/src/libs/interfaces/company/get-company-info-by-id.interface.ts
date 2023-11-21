import { Transaction } from 'sequelize';

export interface GetCompanyInfoByIdInterface {
  companyId: string;
  limit: string;
  page: string;
  trx?: Transaction;
}
