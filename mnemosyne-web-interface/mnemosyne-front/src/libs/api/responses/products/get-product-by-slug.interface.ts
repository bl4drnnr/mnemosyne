import { Currency } from '@interfaces/currency.type';
import { ProductCategory } from '@interfaces/product-category.type';

export interface GetProductBySlug {
  title: string;
  description: string;
  pictures: Array<string>;
  location: string;
  currency: Currency;
  price: number;
  subcategory: string;
  contactPerson: string;
  contactPhone: string;
  category: ProductCategory;
  productUserFirstName?: string;
  productUserLastName?: string;
}

export interface GetProductBySlugResponse {
  product: GetProductBySlug;
}
