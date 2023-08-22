import { Transaction } from 'sequelize';
import { Language } from '@interfaces/language.enum';

export interface ConfirmCompanyCreationInterface {
  companyId: string;
  language?: Language;
  trx?: Transaction;
}
