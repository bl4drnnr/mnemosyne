import { ProductCategory } from '@interfaces/product-category.type';
import { Currency } from '@interfaces/currency.type';

export interface LatestProducts {
  title: string;
  slug: string;
  mainPicture: string;
  currency: Currency;
  price: number;
  category: ProductCategory;
  subcategory: string;
}

export interface GetLatestProductsResponse {
  latestProducts: Array<LatestProducts>;
}
