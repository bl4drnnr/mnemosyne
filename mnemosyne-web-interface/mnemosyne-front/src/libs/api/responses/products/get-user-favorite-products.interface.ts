import { ProductCategory } from '@interfaces/product-category.type';
import { Currency } from '@interfaces/currency.type';

export interface FavoriteProduct {
  id: string;
  title: string;
  slug: string;
  mainPicture: string;
  currency: Currency;
  price: number;
  subcategory: string;
  category: ProductCategory;
  createdAt: Date;
}

export interface GetUserFavoriteProductsResponse {
  favoriteProducts: Array<FavoriteProduct>;
  count: number;
}
