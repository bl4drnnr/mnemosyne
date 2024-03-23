import { Category } from '@models/category.model';
import { ProductCurrency } from '@interfaces/product-currency.enum';

export interface ProductBySlugInterface {
  title: string;
  description: string;
  pictures: Array<string>;
  currency: ProductCurrency;
  price: number;
  subcategory: string;
  category: Category;
  productUserFirstName: string;
  productUserLastName: string;
}
