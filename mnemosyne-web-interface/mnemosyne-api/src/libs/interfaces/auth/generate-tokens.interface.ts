import { Transaction } from 'sequelize';

export interface GenerateTokensInterface {
  roles: Array<string>;
  userId: string;
  companyId: string | null;
  trx?: Transaction;
}
