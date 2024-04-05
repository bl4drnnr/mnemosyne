import { DeleteProductsFromFavoritesDto } from '@dto/delete-products-from-favorites.dto';
import { Transaction } from 'sequelize';

export interface DeleteProductFromFavoritesInterface {
  userId: string;
  payload: DeleteProductsFromFavoritesDto;
  trx?: Transaction;
}
