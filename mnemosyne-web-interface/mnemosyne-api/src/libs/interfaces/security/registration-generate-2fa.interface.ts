import { Transaction } from 'sequelize';

export interface RegistrationGenerate2faInterface {
  confirmationHash: string;
  trx?: Transaction;
}
