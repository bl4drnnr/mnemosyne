import { RegistrationSendSmsCodeDto } from '@dto/registration-send-sms-code.dto';
import { Transaction } from 'sequelize';

export interface RegistrationSendSmsInterface {
  payload: RegistrationSendSmsCodeDto;
  confirmationHash: string;
  trx?: Transaction;
}
