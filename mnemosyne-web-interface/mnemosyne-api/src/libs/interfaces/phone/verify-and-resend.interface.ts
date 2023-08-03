import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { Transaction } from 'sequelize';

export interface VerifyAndResendInterface {
  userId: string;
  phone: string;
  language?: LANGUAGE_TYPES;
  trx?: Transaction;
}
