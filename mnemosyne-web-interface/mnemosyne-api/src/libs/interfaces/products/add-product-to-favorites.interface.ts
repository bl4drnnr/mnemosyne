import { AddProductToFavoritesDto } from '@dto/add-product-to-favorites.dto';
import { Transaction } from 'sequelize';

export interface AddProductToFavoritesInterface {
  userId: string;
  payload: AddProductToFavoritesDto;
  trx?: Transaction;
}
