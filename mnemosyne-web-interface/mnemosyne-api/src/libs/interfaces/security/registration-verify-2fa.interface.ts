import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { Transaction } from 'sequelize';

export interface RegistrationVerify2faInterface {
  payload: VerifyTwoFaDto;
  confirmationHash: string;
  trx?: Transaction;
}
