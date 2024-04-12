import { Transaction } from 'sequelize';

export interface GenerateTokensInterface {
  role?: { id: string; name: string; description: string };
  userId: string;
  companyId: string | null;
  trx?: Transaction;
}
