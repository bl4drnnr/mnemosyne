import { Transaction } from 'sequelize';

export interface VerifyUserCredentialsInterface {
  email: string;
  password: string;
  trx?: Transaction;
}
