import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { Transaction } from 'sequelize';

export interface LoginVerifyPhoneInterface {
  payload: VerifyMobilePhoneDto;
  trx?: Transaction;
}
