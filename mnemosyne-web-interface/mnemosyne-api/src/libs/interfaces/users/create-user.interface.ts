import { CreateUserDto } from '@dto/create-user.dto';
import { Transaction } from 'sequelize';
import { User } from '@models/user.model';
import { Role } from '@custom-types/role.type';

export interface CreateUserInterface {
  payload: CreateUserDto | Partial<User>;
  role?: Role;
  trx?: Transaction;
}
