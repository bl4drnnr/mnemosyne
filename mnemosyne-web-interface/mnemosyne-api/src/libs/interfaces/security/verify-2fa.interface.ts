import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { Transaction } from 'sequelize';

export interface Verify2faInterface {
  payload: VerifyTwoFaDto;
  userId: string;
  trx?: Transaction;
}
