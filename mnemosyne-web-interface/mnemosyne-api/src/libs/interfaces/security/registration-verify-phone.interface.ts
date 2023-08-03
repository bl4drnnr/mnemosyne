import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { Transaction } from 'sequelize';

export interface RegistrationVerifyPhoneInterface {
  payload: VerifyMobilePhoneDto;
  confirmationHash: string;
  trx?: Transaction;
}
