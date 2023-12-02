import { AssignRoleDto } from '@dto/assign-role.dto';
import { Transaction } from 'sequelize';

export interface AssignRoleInterface {
  companyId: string;
  payload: AssignRoleDto;
  trx?: Transaction;
}
