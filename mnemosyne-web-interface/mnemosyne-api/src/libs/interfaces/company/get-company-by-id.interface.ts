import { Transaction } from 'sequelize';

export interface GetCompanyByIdInterface {
  id: string;
  trx?: Transaction;
}
