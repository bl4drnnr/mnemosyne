import { Transaction } from 'sequelize';

export interface AssignRoleInterface {
  companyId: string;
  roleId: string;
  companyUserId: string;
  trx?: Transaction;
}
