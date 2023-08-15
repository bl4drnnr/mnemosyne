import { Language } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface HashSendSmsInterface {
  confirmationHash: string;
  language?: Language;
  trx?: Transaction;
}
