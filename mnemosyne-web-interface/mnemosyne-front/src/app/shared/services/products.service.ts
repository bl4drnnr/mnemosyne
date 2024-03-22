import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { ProductsEndpoint } from '@interfaces/products.enum';
import { GetProductBySlugPayload } from '@payloads/get-product-by-slug.interface';
import { PostProductPayload } from '@payloads/post-product.interface';
import { Observable } from 'rxjs';
import { ProductPostedResponse } from '@responses/product-posted.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private readonly apiService: ApiService) {}

  getProductBySlug({ slug }: GetProductBySlugPayload) {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.GET_PRODUCT,
      params: { slug }
    });
  }

  postProduct(payload: PostProductPayload): Observable<ProductPostedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.POST_PRODUCT,
      payload
    });
  }
}
