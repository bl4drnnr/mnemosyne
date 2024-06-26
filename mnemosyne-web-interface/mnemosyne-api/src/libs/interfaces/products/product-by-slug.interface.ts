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
  contactPhone?: string;
  category: string;
  createdAt: Date;
  ownerId?: string;
  ownerIdHash?: string;
  productInFavorites?: boolean;
  onBehalfOfCompany: boolean;
  companyId?: string;
  companyName?: string;
}
