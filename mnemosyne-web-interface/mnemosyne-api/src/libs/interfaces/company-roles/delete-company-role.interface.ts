import { Transaction } from 'sequelize';
import { DeleteCompanyRoleDto } from '@dto/delete-company-role.dto';

export interface DeleteCompanyRoleInterface {
  companyId: string;
  payload: DeleteCompanyRoleDto;
  trx?: Transaction;
}
