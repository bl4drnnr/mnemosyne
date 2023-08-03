import { Transaction } from 'sequelize';

export interface VerifySmsCodeInterface {
  providedPhone: string;
  providedCode: string;
  userId: string;
  trx?: Transaction;
}
