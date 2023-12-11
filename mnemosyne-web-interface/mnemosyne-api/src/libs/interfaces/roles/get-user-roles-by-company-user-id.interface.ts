import { Transaction } from 'sequelize';

export interface GetUserRolesByCompanyUserIdInterface {
  companyUserId: string;
  trx?: Transaction;
}
