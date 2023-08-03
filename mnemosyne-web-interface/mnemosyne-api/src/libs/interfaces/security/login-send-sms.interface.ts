import { LoginSendSmsDto } from '@dto/login-send-sms.dto';
import { Transaction } from 'sequelize';

export interface LoginSendSmsInterface {
  payload: LoginSendSmsDto;
  trx?: Transaction;
}
