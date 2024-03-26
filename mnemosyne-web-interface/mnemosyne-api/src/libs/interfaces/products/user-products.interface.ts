import { ProductCurrency } from '@interfaces/product-currency.enum';

export interface UserProductsInterface {
  title: string;
  slug: string;
  mainPicture: string;
  location: string;
  currency: ProductCurrency;
  price: number;
  subcategory: string;
  category: string;
  createdAt: Date;
  contactPerson: string;
  contactPhone: string;
}
