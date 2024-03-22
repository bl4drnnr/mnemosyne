import { ProductPostedMessages } from '@responses/product-posted.enum';

export interface ProductPostedResponse {
  message: ProductPostedMessages;
  link: string;
}
