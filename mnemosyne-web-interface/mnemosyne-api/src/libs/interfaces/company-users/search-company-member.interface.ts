import { Transaction } from 'sequelize';

export interface SearchCompanyMemberInterface {
  companyId: string;
  query: string;
  trx?: Transaction;
}
