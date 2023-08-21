import { Transaction } from 'sequelize';

export interface ConfirmCompanyAccountInterface {
  companyId: string;
  trx?: Transaction;
}
