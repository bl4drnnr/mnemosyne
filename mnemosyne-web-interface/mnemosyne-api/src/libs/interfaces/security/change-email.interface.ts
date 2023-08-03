import { ChangeEmailDto } from '@dto/change-email.dto';
import { Transaction } from 'sequelize';

export interface ChangeEmailInterface {
  userId: string;
  payload: ChangeEmailDto;
  trx?: Transaction;
}
