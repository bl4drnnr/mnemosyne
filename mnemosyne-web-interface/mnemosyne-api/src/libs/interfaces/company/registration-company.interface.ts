import { CreateCompanyDto } from '@dto/create-company.dto';
import { Transaction } from 'sequelize';

export interface RegistrationCompanyInterface {
  payload: CreateCompanyDto;
  trx?: Transaction;
}
