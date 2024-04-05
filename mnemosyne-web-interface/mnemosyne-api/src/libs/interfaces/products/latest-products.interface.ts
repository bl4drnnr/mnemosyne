import { ProductCurrency } from '@interfaces/product-currency.enum';

export interface LatestProductsInterface {
  title: string;
  slug: string;
  mainPicture: string;
  currency: ProductCurrency;
  price: number;
  subcategory: string;
  category: string;
}
