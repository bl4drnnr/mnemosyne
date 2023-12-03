import { DeleteCompanyMemberDto } from '@dto/delete-company-member.dto';
import { Transaction } from 'sequelize';

export interface DeleteCompanyMemberInterface {
  userId: string;
  companyId: string;
  payload: DeleteCompanyMemberDto;
  memberId: string;
  trx?: Transaction;
}
