import { CreateUserDto } from '@dto/create-user.dto';
import { Transaction } from 'sequelize';
import { User } from '@models/user.model';

export interface CreateUserInterface {
  payload: CreateUserDto | Partial<User>;
  trx?: Transaction;
}
