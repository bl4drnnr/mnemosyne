import { DisableTwoFaDto } from '@dto/disable-two-fa.dto';
import { Transaction } from 'sequelize';

export interface DisablePhoneInterface {
  payload: DisableTwoFaDto;
  userId: string;
  trx?: Transaction;
}
