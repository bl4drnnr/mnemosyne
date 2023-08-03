import { Transaction } from 'sequelize';

export interface GetUserSecuritySettingsInterface {
  userId: string;
  trx?: Transaction;
}
