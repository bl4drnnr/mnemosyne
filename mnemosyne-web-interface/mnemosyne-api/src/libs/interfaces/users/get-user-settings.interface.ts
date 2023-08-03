import { Transaction } from 'sequelize';

export interface GetUserSettingsInterface {
  userId: string;
  trx?: Transaction;
}
