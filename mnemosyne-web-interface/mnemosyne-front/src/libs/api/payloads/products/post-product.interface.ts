import { Currency } from '@interfaces/currency.type';
import { ProductCategory } from '@interfaces/product-category.type';
import { ProductSubcategory } from '@interfaces/product-subcategory.type';

export interface PostProductPayload {
  id?: string;
  title: string;
  description: string;
  pictures: Array<string | ArrayBuffer | null>;
  currency: Currency;
  price: number;
  location: string;
  contactPhone: string;
  contactPerson: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  postOnBehalfOfCompany: boolean;
}
