import { LanguageEnum } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface GetSmsInterface {
  userId: string;
  language?: LanguageEnum;
  trx?: Transaction;
}
