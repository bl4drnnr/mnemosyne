import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { Transaction } from 'sequelize';

export interface InviteUserToCompanyInterface {
  payload: InviteUserToCompanyDto;
  trx?: Transaction;
}
