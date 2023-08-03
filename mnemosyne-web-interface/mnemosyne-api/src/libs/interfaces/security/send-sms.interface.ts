import { RegistrationSendSmsCodeDto } from '@dto/registration-send-sms-code.dto';
import { Transaction } from 'sequelize';

export interface SendSmsInterface {
  payload: RegistrationSendSmsCodeDto;
  userId: string;
  trx?: Transaction;
}
