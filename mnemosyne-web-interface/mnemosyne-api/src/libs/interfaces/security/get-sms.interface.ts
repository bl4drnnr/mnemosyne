import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { Transaction } from 'sequelize';

export interface GetSmsInterface {
  userId: string;
  language?: LANGUAGE_TYPES;
  trx?: Transaction;
}
