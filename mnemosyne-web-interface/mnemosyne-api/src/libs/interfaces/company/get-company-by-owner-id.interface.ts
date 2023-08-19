import { Transaction } from 'sequelize';

export interface GetCompanyByOwnerIdInterface {
  companyOwnerId: string;
  trx?: Transaction;
}
