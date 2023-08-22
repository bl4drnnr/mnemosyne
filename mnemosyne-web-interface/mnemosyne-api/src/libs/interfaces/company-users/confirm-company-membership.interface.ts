import { Transaction } from 'sequelize';
import { Language } from '@interfaces/language.enum';

export interface ConfirmCompanyMembershipInterface {
  userId: string;
  language?: Language;
  trx?: Transaction;
}
