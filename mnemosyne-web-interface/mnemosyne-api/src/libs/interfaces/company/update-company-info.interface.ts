import { Transaction } from 'sequelize';
import { UpdateCompanyDto } from '@dto/update-company.dto';

export interface UpdateCompanyInfoInterface {
  companyId: string;
  payload: UpdateCompanyDto;
  trx?: Transaction;
}
