import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { ProductsEndpoint } from '@interfaces/products.enum';
import { GetProductBySlugPayload } from '@payloads/get-product-by-slug.interface';
import { PostProductPayload } from '@payloads/post-product.interface';
import { Observable } from 'rxjs';
import { ProductPostedResponse } from '@responses/product-posted.interface';
import { GetProductBySlugResponse } from '@responses/get-product-by-slug.interface';
import { ProductUpdatedResponse } from '@responses/product-updated.interface';
import { GetUserProductsPayload } from '@payloads/get-user-products.interface';
import { UserProductsResponse } from '@responses/user-products.interface';
import { DeleteProductPayload } from '@payloads/delete-product.interface';
import { ProductDeletedResponse } from '@responses/product-deleted.enum';
import { SearchProductsResponse } from '@responses/search-products.interface';
import { SearchProductsPayload } from '@payloads/search-products.interface';
import { GetLatestProductsResponse } from '@responses/get-latest-products.interface';
import { AddProductToFavoritesPayload } from '@payloads/add-product-to-favorites.interface';
import { ProductAddedToFavoritesResponse } from '@responses/product-added-to-favorites.interface';
import { DeleteProductFromFavoritesPaylaod } from '@payloads/delete-product-from-favorites.interface';
import { ProductDeletedFromFavoritesResponse } from '@responses/product-deleted-from-favorites.interface';
import { GetUserFavoriteProductsPayload } from '@payloads/get-user-favorite-products.interface';
import { GetUserFavoriteProductsResponse } from '@responses/get-user-favorite-products.interface';
import { GetProductContactEmailPayload } from '@payloads/get-product-contact-email.interface';
import { GetProductContactPhonePayload } from '@payloads/get-product-contact-phone.interface';
import { GetProductContactEmailResponse } from '@responses/get-product-contact-email.interface';
import { GetProductContactPhoneResponse } from '@responses/get-product-contact-phone.interface';
import { GetMarketplaceUserStatsPayload } from '@payloads/get-marketplace-user-stats.interface';
import { GetMarketplaceUserStatsResponse } from '@responses/get-marketplace-user-stats.interface';

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

  deleteProductFromFavorites(
    payload: DeleteProductFromFavoritesPaylaod
  ): Observable<{ message: ProductDeletedFromFavoritesResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.DELETE_FROM_FAVORITES,
      payload
    });
  }

  addProductToFavorites(
    payload: AddProductToFavoritesPayload
  ): Observable<{ message: ProductAddedToFavoritesResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.ADD_TO_FAVORITES,
      payload
    });
  }

  getUserFavoritesProducts(
    params: GetUserFavoriteProductsPayload
  ): Observable<GetUserFavoriteProductsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.GET_FAVORITES,
      params
    });
  }

  getProductContactEmail(
    params: GetProductContactEmailPayload
  ): Observable<GetProductContactEmailResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.PRODUCT_CONTACT_EMAIL,
      params
    });
  }

  getProductContactPhone(
    params: GetProductContactPhonePayload
  ): Observable<GetProductContactPhoneResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.PRODUCT_CONTACT_PHONE,
      params
    });
  }

  getMarketplaceUserStatistics(
    params: GetMarketplaceUserStatsPayload
  ): Observable<GetMarketplaceUserStatsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRODUCTS,
      action: ProductsEndpoint.MARKETPLACE_USER_STATISTICS,
      params
    });
  }
}
