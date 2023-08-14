import { LanguageEnum } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface HashSendSmsInterface {
  confirmationHash: string;
  language?: LanguageEnum;
  trx?: Transaction;
}
