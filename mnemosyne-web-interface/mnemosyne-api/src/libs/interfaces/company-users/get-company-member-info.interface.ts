import { Transaction } from 'sequelize';

export interface GetCompanyMemberInfoInterface {
  companyId: string;
  memberId: string;
  trx?: Transaction;
}
