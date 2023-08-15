import { Language } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface GetSmsInterface {
  userId: string;
  language?: Language;
  trx?: Transaction;
}
