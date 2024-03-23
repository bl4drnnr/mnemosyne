import { PostProductDto } from '@dto/post-product.dto';
import { Transaction } from 'sequelize';

export interface PostProductInterface {
  userId: string;
  payload: PostProductDto;
  trx?: Transaction;
}
