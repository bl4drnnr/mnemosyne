import { Transaction } from 'sequelize';
import { RevokeRoleDto } from '@dto/revoke-role.dto';

export interface RevokeRoleInterface {
  companyId: string;
  payload: RevokeRoleDto;
  trx?: Transaction;
}
