import { Currency } from '@interfaces/currency.type';
import { ProductCategory } from '@interfaces/product-category.type';

export interface GetProductBySlug {
  id?: string;
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
  createdAt: Date;
  productUserFirstName?: string;
  productUserLastName?: string;
}

export interface GetProductBySlugResponse {
  product: GetProductBySlug;
}
