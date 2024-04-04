import { Component, OnInit } from '@angular/core';
import { ProductsService } from '@services/products.service';
import { TranslationService } from '@services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetProductBySlug } from '@responses/get-product-by-slug.interface';
import { Titles } from '@interfaces/titles.enum';
import { EnvService } from '@shared/env.service';
import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { MessagesTranslation } from '@translations/messages.enum';
import { GlobalMessageService } from '@shared/global-message.service';
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

  handleProductFavorite() {
    if (this.product.productInFavorites) this.deleteProductFromFavorites();
    else this.addProductToFavorites();
  }

  deleteProductFromFavorites() {
    this.productsService
      .deleteProductFromFavorites({
        productId: this.product.id
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

  addProductToFavorites() {
    this.productsService
      .addProductToFavorites({
        productId: this.product.id
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
