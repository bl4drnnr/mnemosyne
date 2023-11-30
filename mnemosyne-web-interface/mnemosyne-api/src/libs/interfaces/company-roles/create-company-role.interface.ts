import { Transaction } from 'sequelize';
import { CreateCompanyRoleDto } from '@dto/create-company-role.dto';

export interface CreateCompanyRoleInterface {
  companyId: string;
  payload: CreateCompanyRoleDto;
  trx?: Transaction;
}
