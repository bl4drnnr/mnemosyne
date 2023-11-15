import { Role } from '@custom-types/role.type';
import { Transaction } from 'sequelize';

export interface GrantRoleInterface {
  userId: string;
  value: Role;
  trx?: Transaction;
}
