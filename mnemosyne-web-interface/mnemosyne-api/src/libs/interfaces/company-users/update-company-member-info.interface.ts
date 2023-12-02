import { Transaction } from 'sequelize';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';

export interface UpdateCompanyMemberInfoInterface {
  companyId: string;
  payload: UpdateUserInfoDto;
  memberId: string;
  trx?: Transaction;
}
