import { ProductUpdatedMessage } from '@responses/product-updated.enum';

export interface ProductUpdatedResponse {
  message: ProductUpdatedMessage;
  link: string;
}
