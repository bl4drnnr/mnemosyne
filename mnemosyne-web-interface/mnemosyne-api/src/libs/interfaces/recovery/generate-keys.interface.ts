import { GenerateRecoveryKeysDto } from '@dto/generate-recovery-keys.dto';
import { Transaction } from 'sequelize';

export interface GenerateKeysInterface {
  payload: GenerateRecoveryKeysDto;
  userId: string;
  trx?: Transaction;
}
