import { Transaction } from 'sequelize';

export interface CreateCompanyInterface {
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyOwnerId: string;
  tac: boolean;
  trx?: Transaction;
}
