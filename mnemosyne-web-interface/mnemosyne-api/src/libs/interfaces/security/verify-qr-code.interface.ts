import { Transaction } from 'sequelize';

export interface VerifyQrCodeInterface {
  userId: string;
  code: string;
  twoFaToken: string;
  trx?: Transaction;
}
