import { Language } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface VerifyAndResendInterface {
  userId: string;
  phone: string;
  language?: Language;
  trx?: Transaction;
}
