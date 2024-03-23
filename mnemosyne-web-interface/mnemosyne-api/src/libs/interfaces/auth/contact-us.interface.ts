import { ContactUsDto } from '@dto/contact-us.dto';
import { Transaction } from 'sequelize';

export interface ContactUsInterface {
  payload: ContactUsDto;
  trx?: Transaction;
}
