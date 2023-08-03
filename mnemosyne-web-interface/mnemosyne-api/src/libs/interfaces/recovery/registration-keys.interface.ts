import { GenerateRecoveryKeysDto } from '@dto/generate-recovery-keys.dto';
import { Transaction } from 'sequelize';

export interface RegistrationKeysInterface {
  confirmationHash: string;
  payload: GenerateRecoveryKeysDto;
  trx?: Transaction;
}
