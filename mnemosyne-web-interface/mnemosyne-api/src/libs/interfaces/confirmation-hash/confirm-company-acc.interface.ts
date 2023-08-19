import { Transaction } from 'sequelize';
import { ConfirmCompanyAccDto } from '@dto/confirm-company-acc.dto';

export interface ConfirmCompanyAccInterface {
  payload: ConfirmCompanyAccDto;
  confirmationHash: string;
  trx?: Transaction;
}
