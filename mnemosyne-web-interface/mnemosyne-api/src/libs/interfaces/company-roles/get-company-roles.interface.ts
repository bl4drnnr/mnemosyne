import { Transaction } from 'sequelize';

export interface GetCompanyRolesInterface {
  companyId: string;
  trx?: Transaction;
}
