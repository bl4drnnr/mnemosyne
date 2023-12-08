import { Transaction } from 'sequelize';

export interface GenerateTokensInterface {
  roles?: Array<{ id: string; name: string; description: string }>;
  userId: string;
  companyId: string | null;
  trx?: Transaction;
}
