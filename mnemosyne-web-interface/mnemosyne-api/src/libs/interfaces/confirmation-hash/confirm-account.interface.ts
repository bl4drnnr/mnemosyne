import { LanguageEnum } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface ConfirmAccountInterface {
  confirmationHash: string;
  language?: LanguageEnum;
  trx?: Transaction;
}
