import { Transaction } from 'sequelize';

export interface CreateCompanyInterface {
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyOwnerEmail: string;
  trx?: Transaction;
}
