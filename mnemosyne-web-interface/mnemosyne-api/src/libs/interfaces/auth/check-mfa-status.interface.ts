import { UserSettings } from '@models/user-settings.model';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { Transaction } from 'sequelize';

export interface CheckMfaStatusInterface {
  mfaCode: string;
  phoneCode: string;
  userSettings: UserSettings;
  userId: string;
  language?: LANGUAGE_TYPES;
  trx?: Transaction;
}
