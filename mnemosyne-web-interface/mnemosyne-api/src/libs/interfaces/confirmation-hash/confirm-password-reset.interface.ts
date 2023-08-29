import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { Transaction } from 'sequelize';

export interface ConfirmPasswordResetInterface {
  hash: string;
  payload: ResetUserPasswordDto;
  trx?: Transaction;
}
