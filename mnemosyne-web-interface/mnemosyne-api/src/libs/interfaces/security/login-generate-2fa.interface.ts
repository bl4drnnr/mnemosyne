import { LoginGenerate2faQrDto } from '@dto/login-generate-2fa-qr.dto';
import { Transaction } from 'sequelize';

export interface LoginGenerate2faInterface {
  payload: LoginGenerate2faQrDto;
  trx?: Transaction;
}
