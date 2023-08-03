import { Transaction } from 'sequelize';

export interface GetUserByRecoveryKeysInterface {
  recoveryKeysFingerprint: string;
  trx?: Transaction;
}
