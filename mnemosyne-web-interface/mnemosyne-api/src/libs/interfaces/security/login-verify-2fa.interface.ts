import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { Transaction } from 'sequelize';

export interface LoginVerify2faInterface {
  payload: VerifyTwoFaDto;
  trx?: Transaction;
}
