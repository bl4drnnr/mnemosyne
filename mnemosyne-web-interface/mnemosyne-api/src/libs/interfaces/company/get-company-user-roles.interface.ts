import { Transaction } from 'sequelize';

export interface GetCompanyUserRolesInterface {
  companyUserId: string;
  trx?: Transaction;
}
