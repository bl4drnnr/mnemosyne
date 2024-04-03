import {Injectable} from '@angular/core';
import {ApiService} from '@shared/api.service';
import {Controller} from '@interfaces/controller.enum';
import {Method} from '@interfaces/methods.enum';
import {ProductsEndpoint} from '@interfaces/products.enum';
import {GetProductBySlugPayload} from '@payloads/get-product-by-slug.interface';
import {PostProductPayload} from '@payloads/post-product.interface';
import {Observable} from 'rxjs';
import {ProductPostedResponse} from '@responses/product-posted.interface';
import {GetProductBySlugResponse} from '@responses/get-product-by-slug.interface';
import {ProductUpdatedResponse} from '@responses/product-updated.interface';
import {GetUserProductsPayload} from '@payloads/get-user-products.interface';
import {UserProductsResponse} from '@responses/user-products.interface';
import {DeleteProductPayload} from '@payloads/delete-product.interface';
import {ProductDeletedResponse} from '@responses/product-deleted.enum';
import {SearchProductsResponse} from '@responses/search-products.interface';
import {SearchProductsPayload} from '@payloads/search-products.interface';
import {GetLatestProductsResponse} from "@responses/get-latest-products.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private readonly apiService: ApiService) {}

  getProductBySlug({
    slug
  }: GetProductBySlugPayload): Observable<GetProductBySlugResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.GET_PRODUCT,
      params: { slug }
    });
  }
  
  getLatestProducts(): Observable<GetLatestProductsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.LATEST_PRODUCTS
    });
  }

  searchProducts(
    params: SearchProductsPayload
  ): Observable<SearchProductsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.SEARCH_PRODUCTS,
      params
    });
  }

  postProduct(payload: PostProductPayload): Observable<ProductPostedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.CREATE_PRODUCT,
      payload
    });
  }

  getProductBySlugToEdit({
    slug
  }: GetProductBySlugPayload): Observable<GetProductBySlugResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.GET_PRODUCT_TO_UPDATE,
      params: { slug }
    });
  }

  updateProduct(
    payload: PostProductPayload
  ): Observable<ProductUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.UPDATE_PRODUCT,
      payload
    });
  }

  getUserProducts(
    params: GetUserProductsPayload
  ): Observable<UserProductsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.USER_PRODUCTS,
      params
    });
  }

  deleteProduct(
    payload: DeleteProductPayload
  ): Observable<{ message: ProductDeletedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.DELETE_PRODUCT,
      payload
    });
  }
}
