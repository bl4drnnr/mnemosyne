import { ProductCurrency } from '@interfaces/product-currency.enum';

export interface SearchedProductsInterface {
  title: string;
  slug: string;
  mainPicture: string;
  currency: ProductCurrency;
  price: number;
  category: string;
  subcategory: string;
  productInFavorites: boolean;
  createdAt: Date;
}
