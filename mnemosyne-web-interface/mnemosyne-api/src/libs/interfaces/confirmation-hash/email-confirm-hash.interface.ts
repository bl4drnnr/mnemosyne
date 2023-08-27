import { Transaction } from 'sequelize';
import { EmailSettingsInterface } from '@interfaces/email-settings.interface';

export interface EmailConfirmHashInterface {
  emailSettings: EmailSettingsInterface;
  trx?: Transaction;
}
