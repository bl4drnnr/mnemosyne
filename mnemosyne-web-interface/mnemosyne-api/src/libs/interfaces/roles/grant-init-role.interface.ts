import { Role } from '@custom-types/role.type';
import { Transaction } from 'sequelize';

export interface GrantInitRoleInterface {
  companyUserId: string;
  companyId: string;
  role: Role;
  trx?: Transaction;
}
