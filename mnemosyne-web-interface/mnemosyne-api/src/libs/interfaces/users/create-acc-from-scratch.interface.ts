import { User } from '@models/user.model';
import { Transaction } from 'sequelize';
import { ConfirmCompanyAccDto } from '@dto/confirm-company-acc.dto';
import { ConfirmationHash } from '@models/confirmation-hash.model';

export interface CreateAccFromScratchInterface {
  user: Partial<User>;
  hash: ConfirmationHash;
  payload: ConfirmCompanyAccDto;
  trx?: Transaction;
}
