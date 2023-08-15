import { Language } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface ConfirmAccountInterface {
  confirmationHash: string;
  language?: Language;
  trx?: Transaction;
}
