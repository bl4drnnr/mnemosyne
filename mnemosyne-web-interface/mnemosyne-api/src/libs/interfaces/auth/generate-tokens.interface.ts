import { Role } from '@models/role.model';
import { Transaction } from 'sequelize';

export interface GenerateTokensInterface {
  roles: Array<Role>;
  userId: string;
  companyId: string | null;
  trx?: Transaction;
}
