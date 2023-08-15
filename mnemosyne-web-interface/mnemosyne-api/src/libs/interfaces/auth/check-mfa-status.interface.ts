import { UserSettings } from '@models/user-settings.model';
import { Language } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface CheckMfaStatusInterface {
  mfaCode: string;
  phoneCode: string;
  userSettings: UserSettings;
  userId: string;
  language?: Language;
  trx?: Transaction;
}
