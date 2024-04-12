import { ChangeCompanyMemberRoleDto } from '@dto/change-company-member-role.dto';
import { Transaction } from 'sequelize';

export interface ChangeCompanyMemberRoleInterface {
  companyId: string;
  payload: ChangeCompanyMemberRoleDto;
  trx?: Transaction;
}
