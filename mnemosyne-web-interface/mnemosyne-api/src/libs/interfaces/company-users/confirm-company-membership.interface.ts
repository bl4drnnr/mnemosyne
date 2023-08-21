import { Transaction } from 'sequelize';

export interface ConfirmCompanyMembershipInterface {
  userId: string;
  trx?: Transaction;
}
