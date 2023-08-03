import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { Transaction } from 'sequelize';

export interface ConfirmPasswordResetInterface {
  payload: ResetUserPasswordDto;
  trx?: Transaction;
}
