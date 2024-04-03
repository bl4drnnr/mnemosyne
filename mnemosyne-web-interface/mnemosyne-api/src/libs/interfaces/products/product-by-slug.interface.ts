import { ProductCurrency } from '@interfaces/product-currency.enum';

export interface ProductBySlugInterface {
  id?: string;
  title: string;
  description: string;
  pictures: Array<string>;
  location: string;
  currency: ProductCurrency;
  price: number;
  subcategory: string;
  contactPerson: string;
  contactPhone: string;
  category: string;
  createdAt: Date;
  productUserFirstName?: string;
  productUserLastName?: string;
}
