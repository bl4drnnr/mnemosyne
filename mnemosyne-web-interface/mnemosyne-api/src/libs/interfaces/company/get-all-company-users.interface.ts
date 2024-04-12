import { Transaction } from 'sequelize';

export interface GetAllCompanyUsersInterface {
  companyId: string;
  trx?: Transaction;
}
