import { ProductCurrency } from '@interfaces/product-currency.enum';

export interface SearchedProductsInterface {
  title: string;
  slug: string;
  mainPicture: string;
  currency: ProductCurrency;
  price: number;
  category: string;
  subcategory: string;
  location: string | null;
  contactPhone: string | null;
  contactPerson: string | null;
  productInFavorites: boolean;
  createdAt: Date;
}
