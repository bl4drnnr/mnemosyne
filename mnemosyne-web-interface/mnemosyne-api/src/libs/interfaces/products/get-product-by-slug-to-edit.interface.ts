import { Transaction } from 'sequelize';

export interface GetProductBySlugToEditInterface {
  companyId: string;
  userId: string;
  slug: string;
  companyEdit: string;
  trx?: Transaction;
}
