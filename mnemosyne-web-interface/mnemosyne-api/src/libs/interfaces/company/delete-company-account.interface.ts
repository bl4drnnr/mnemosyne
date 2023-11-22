import { Transaction } from 'sequelize';
import { DeleteCompanyDto } from '@dto/delete-company.dto';

export interface DeleteCompanyAccountInterface {
  userId: string;
  payload: DeleteCompanyDto;
  trx?: Transaction;
}
