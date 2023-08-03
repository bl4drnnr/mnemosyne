import { ChangePasswordDto } from '@dto/change-password.dto';
import { Transaction } from 'sequelize';

export interface ChangePasswordInterface {
  userId: string;
  payload: ChangePasswordDto;
  trx?: Transaction;
}
