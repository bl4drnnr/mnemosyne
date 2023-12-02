import { UpdateCompanyRoleDto } from '@dto/update-company-role.dto';
import { Transaction } from 'sequelize';

export interface UpdateCompanyRoleInterface {
  companyId: string;
  payload: UpdateCompanyRoleDto;
  trx?: Transaction;
}
