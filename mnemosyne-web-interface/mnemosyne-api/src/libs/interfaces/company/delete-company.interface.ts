import { Transaction } from 'sequelize';
import { DeleteCompanyDto } from '@dto/delete-company.dto';

export interface DeleteCompanyInterface {
  companyId: string;
  userId: string;
  payload: DeleteCompanyDto;
  trx?: Transaction;
}
