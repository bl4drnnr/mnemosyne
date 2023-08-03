import { CreateUserDto } from '@dto/create-user.dto';
import { Transaction } from 'sequelize';

export interface RegistrationInterface {
  payload: CreateUserDto;
  trx?: Transaction;
}
