import { Transaction } from 'sequelize';

export interface UpdateUserRoleInterface {
  companyUserId: string;
  companyId: string;
  newRoleId: string;
  trx?: Transaction;
}
