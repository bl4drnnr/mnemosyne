import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { Transaction } from 'sequelize';

export interface VerifyPhoneInterface {
  payload: VerifyMobilePhoneDto;
  userId: string;
  trx?: Transaction;
}
