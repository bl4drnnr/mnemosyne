import { Transaction } from 'sequelize';

export interface CreateUserSettingsInterface {
  userId: string;
  trx?: Transaction;
}
