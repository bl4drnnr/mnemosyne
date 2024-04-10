import { Currency } from '@interfaces/currency.type';
import { ProductCategory } from '@interfaces/product-category.type';

export interface SearchedProducts {
  id: string;
  title: string;
  slug: string;
  mainPicture: string;
  currency: Currency;
  price: number;
  category: ProductCategory;
  subcategory: string;
  location: string | null;
  contactPhone: string | null;
  contactPerson: string | null;
  productInFavorites: boolean;
  createdAt: Date;
}

export interface SearchProductsResponse {
  products: Array<SearchedProducts>;
  count: number;
}
