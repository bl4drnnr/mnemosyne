import { CreateUserDto } from '@dto/create-user.dto';
import { Transaction } from 'sequelize';

export interface CreateUserInterface {
  payload: CreateUserDto;
  trx?: Transaction;
}
