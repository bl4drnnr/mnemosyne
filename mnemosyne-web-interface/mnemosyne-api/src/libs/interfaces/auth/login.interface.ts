import { LogInUserDto } from '@dto/log-in-user.dto';
import { Transaction } from 'sequelize';

export interface LoginInterface {
  payload: LogInUserDto;
  trx?: Transaction;
}
