import { DeleteProductDto } from '@dto/delete-product.dto';
import { Transaction } from 'sequelize';

export interface DeleteProductInterface {
  userId: string;
  payload: DeleteProductDto;
  trx?: Transaction;
}
