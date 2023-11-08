import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { Transaction } from 'sequelize';

export interface InviteUserToCompanyInterface {
  userId: string;
  payload: InviteUserToCompanyDto;
  trx?: Transaction;
}
