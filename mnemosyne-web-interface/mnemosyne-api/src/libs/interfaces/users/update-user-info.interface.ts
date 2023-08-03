import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { Transaction } from 'sequelize';

export interface UpdateUserInfoInterface {
  userId: string;
  payload: UpdateUserInfoDto;
  trx?: Transaction;
}
