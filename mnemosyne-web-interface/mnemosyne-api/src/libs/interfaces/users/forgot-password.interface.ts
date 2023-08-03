import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { Transaction } from 'sequelize';

export interface ForgotPasswordInterface {
  payload: ForgotPasswordDto;
  trx?: Transaction;
}
