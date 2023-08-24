import { Transaction } from 'sequelize';
import { Language } from '@interfaces/language.enum';

export interface ConfirmCompanyCreationInterface {
  userId: string;
  language?: Language;
  trx?: Transaction;
}
