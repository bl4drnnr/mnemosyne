import { Currency } from '@interfaces/currency.type';
import { ProductCategory } from '@interfaces/product-category.type';

export interface UserProduct {
  id: string;
  title: string;
  slug: string;
  mainPicture: string;
  location: string;
  currency: Currency;
  price: number;
  subcategory: string;
  category: ProductCategory;
  createdAt: Date;
  contactPerson: string;
  contactPhone: string;
  productInFavorites: boolean;
}

export interface UserProductsResponse {
  userProducts: Array<UserProduct>;
  count: number;
}
