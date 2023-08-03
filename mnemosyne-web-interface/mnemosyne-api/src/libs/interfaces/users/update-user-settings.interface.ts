import { UserSettings } from '@models/user-settings.model';
import { Transaction } from 'sequelize';

export interface UpdateUserSettingsInterface {
  payload: Partial<UserSettings>;
  userId: string;
  trx?: Transaction;
}
