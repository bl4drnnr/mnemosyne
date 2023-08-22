import { Transaction } from 'sequelize';

export interface CreateCompanyUserInterface {
  userId: string;
  companyId: string;
  trx?: Transaction;
}
