import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { ProductsEndpoint } from '@interfaces/products.enum';
import { GetProductBySlugPayload } from '@payloads/get-product-by-slug.interface';

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
}
