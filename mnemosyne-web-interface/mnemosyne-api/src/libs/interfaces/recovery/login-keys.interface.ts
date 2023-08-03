import { LoginGenerateRecoveryKeysDto } from '@dto/login-generate-recovery-keys.dto';
import { Transaction } from 'sequelize';

export interface LoginKeysInterface {
  payload: LoginGenerateRecoveryKeysDto;
  trx?: Transaction;
}
