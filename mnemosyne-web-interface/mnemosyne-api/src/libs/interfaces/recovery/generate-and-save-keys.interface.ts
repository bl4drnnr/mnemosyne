import { Transaction } from 'sequelize';

export interface GenerateAndSaveKeysInterface {
  passphrase: string;
  userId: string;
  trx?: Transaction;
}
