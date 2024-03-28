import { Currency } from '@interfaces/currency.type';
import { ProductCategory } from '@interfaces/product-category.type';

export interface SearchedProducts {
  title: string;
  slug: string;
  mainPicture: string;
  currency: Currency;
  price: number;
  category: ProductCategory;
  subcategory: string;
  createdAt: Date;
}

export interface SearchProductsResponse {
  products: Array<SearchedProducts>;
  count: number;
}
