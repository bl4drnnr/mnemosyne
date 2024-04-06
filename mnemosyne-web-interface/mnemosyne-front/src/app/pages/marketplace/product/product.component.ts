import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '@services/products.service';
import { TranslationService } from '@services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetProductBySlug } from '@responses/get-product-by-slug.interface';
import { Titles } from '@interfaces/titles.enum';
import { EnvService } from '@shared/env.service';
import { MessagesTranslation } from '@translations/messages.enum';
import { GlobalMessageService } from '@shared/global-message.service';
import { SearchedProducts } from '@responses/search-products.interface';

dayjs.extend(LocalizedFormat);

@Component({
  selector: 'page-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productSlug: string;
  product: GetProductBySlug;
  showSearchProductsModal = false;
  contactEmail: string;
  contactPhone: string;
  similarProducts: Array<SearchedProducts>;
  isUserLoggedIn = false;

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly productsService: ProductsService,
    private readonly translationService: TranslationService,
    private readonly envService: EnvService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  backArrowIcon = `${this.envService.getStaticStorageLink}/icons/backarrowmodal.svg`;
  addToFavoriteIcon = `${this.envService.getStaticStorageLink}/icons/heart.svg`;
  userProfilePictureLink = `${this.envService.getStaticStorageLink}/users-profile-pictures/default.png`;
  googleMapsIcon = `${this.envService.getStaticStorageLink}/icons/google-maps-icon.svg`;
  productPicturesBucket = `${this.envService.getStaticStorageLink}/products/`;
  noProductPicture = `${this.envService.getStaticStorageLink}/icons/add-photo.svg`;

  getProductBySlug() {
    this.productsService
      .getProductBySlug({
        slug: this.productSlug
      })
      .subscribe({
        next: ({ product }) => {
          this.product = product;
          this.translationService.setPageTitle(Titles.PRODUCT, {
            product: product.title
          });
          this.getSimilarProducts();
        },
        error: async () =>
          await this.handleRedirect('marketplace/product-not-found')
      });
  }

  closeSearchProductsModal() {
    this.showSearchProductsModal = false;
  }

  translateCategory(category: string) {
    return `dropdown.${category}`;
  }

  translateSubcategory(category: string, subcategory: string) {
    return `dropdown.${category}Subcategory.${subcategory}`;
  }

  transformDate(date: Date) {
    return dayjs(date).format('LL');
  }

  handleSimilarProductsFavorite(product: SearchedProducts, event: MouseEvent) {
    event.stopPropagation();
    if (product.productInFavorites) this.deleteProductFromFavorites(product.id);
    else this.addProductToFavorites(product.id);
    this.getSimilarProducts();
  }

  handleProductFavorite(productId: string) {
    if (this.product.productInFavorites)
      this.deleteProductFromFavorites(productId);
    else this.addProductToFavorites(productId);
  }

  getSimilarProducts() {
    this.productsService
      .searchProducts({
        page: '0',
        pageSize: '4',
        order: 'created_at',
        orderBy: 'DESC',
        currency: this.product.currency,
        categories: this.product.category,
        maxPrice: String(this.product.price + this.product.price * 0.5),
        minPrice: String(this.product.price - this.product.price * 0.5),
        subcategories: this.product.subcategory
      })
      .subscribe({
        next: ({ products }) => (this.similarProducts = products)
      });
  }

  getProductContactEmail() {
    this.productsService
      .getProductContactEmail({ productId: this.product.id })
      .subscribe({
        next: ({ contactEmail }) => (this.contactEmail = contactEmail),
        error: async () => await this.handleRedirect('login')
      });
  }

  getProductContactPhone() {
    this.productsService
      .getProductContactPhone({ productId: this.product.id })
      .subscribe({
        next: ({ contactPhone }) => (this.contactPhone = contactPhone),
        error: async () => await this.handleRedirect('login')
      });
  }

  deleteProductFromFavorites(productId: string) {
    this.productsService
      .deleteProductFromFavorites({
        productId
      })
      .subscribe({
        next: async ({ message }) => {
          const globalMessage = await this.translationService.translateText(
            message,
            MessagesTranslation.RESPONSES
          );
          this.globalMessageService.handle({
            message: globalMessage
          });
          this.getProductBySlug();
        },
        error: async () => await this.handleRedirect('login')
      });
  }

  addProductToFavorites(productId: string) {
    this.productsService
      .addProductToFavorites({
        productId
      })
      .subscribe({
        next: async ({ message }) => {
          const globalMessage = await this.translationService.translateText(
            message,
            MessagesTranslation.RESPONSES
          );
          this.globalMessageService.handle({
            message: globalMessage
          });
          this.getProductBySlug();
        },
        error: async () => await this.handleRedirect('login')
      });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async handleExternalRedirect(path: string) {
    document.location.href = path;
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('_at');
    this.isUserLoggedIn = !!accessToken;

    this.route.paramMap.subscribe(async (params) => {
      const productSlug = params.get('product-slug');

      if (!productSlug) {
        await this.handleRedirect('marketplace/product-not-found');
      } else {
        this.productSlug = productSlug;
        this.getProductBySlug();
      }
    });
  }
}
