import { PostProductDto } from '@dto/post-product.dto';
import { Transaction } from 'sequelize';

export interface PostProductInterface {
  companyId?: string;
  userId: string;
  payload: PostProductDto;
  trx?: Transaction;
}
