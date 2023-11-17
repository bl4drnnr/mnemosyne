import { Transaction } from 'sequelize';

export interface GetCompanyInfoByIdInterface {
  companyId: string;
  trx?: Transaction;
}
