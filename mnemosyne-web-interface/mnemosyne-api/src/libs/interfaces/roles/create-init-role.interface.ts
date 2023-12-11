import { Transaction } from 'sequelize';
import { Role as RoleType } from '@custom-types/role.type';

export interface CreateInitRoleInterface {
  role: RoleType;
  trx?: Transaction;
}
