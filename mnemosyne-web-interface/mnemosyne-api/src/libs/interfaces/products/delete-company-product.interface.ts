import { DeleteProductDto } from '@dto/delete-product.dto';
import { Transaction } from 'sequelize';

export interface DeleteCompanyProductInterface {
  companyId: string;
  userId: string;
  payload: DeleteProductDto;
  trx?: Transaction;
}
