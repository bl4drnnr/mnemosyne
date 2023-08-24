import { Transaction } from 'sequelize';

export interface ConfirmCompanyMemberInterface {
  userId: string;
  trx?: Transaction;
}
