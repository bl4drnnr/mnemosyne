import * as dayjs from 'dayjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { ProductCategory } from '@interfaces/product-category.type';
import { Currency } from '@interfaces/currency.type';
import { Router } from '@angular/router';
import { DeleteProductPayload } from '@payloads/delete-product.interface';
import { MessagesTranslation } from '@translations/messages.enum';
import { ProductsService } from '@services/products.service';
import { TranslationService } from '@services/translation.service';
import { GlobalMessageService } from '@shared/global-message.service';

@Component({
  selector: 'page-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.scss']
})
export class ProductPreviewComponent {
  showDeleteProductModal: boolean = false;
  deleteProductFullName: string;

  @Input() layoutView: 'list' | 'grid' = 'grid';
  @Input() productId: string;
  @Input() slug: string;
  @Input() mainPicture: string;
  @Input() productTitle: string;
  @Input() category: ProductCategory;
  @Input() subcategory: string;
  @Input() price: number;
  @Input() currency: Currency;
  @Input() location: string | null;
  @Input() contactPerson: string | null;
  @Input() contactPhone: string | null;
  @Input() createdAt: Date;
  @Input() productInFavorites: boolean;
  @Input() showAdditionalInfo: boolean = false;
  @Input() showManagementButtons: boolean = false;
  @Input() productCompanyEdit: boolean = false;

  @Output() deleteProductEvent = new EventEmitter<DeleteProductPayload>();

  productPicturesBucket = `${this.envService.getStaticStorageLink}/products/`;
  uploadPictureIcon = `${this.envService.getStaticStorageLink}/icons/add-photo.svg`;
  addToFavoriteIcon = `${this.envService.getStaticStorageLink}/icons/heart.svg`;

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService,
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  handleExternalRedirect(path: string) {
    document.location.href = path;
  }

  handleProductFavorite(event: MouseEvent) {
    event.stopPropagation();
    if (this.productInFavorites) this.deleteProductFromFavorites();
    else this.addProductToFavorites();
  }

  deleteProductFromFavorites() {
    this.productsService
      .deleteProductFromFavorites({
        productId: this.productId
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
          this.productInFavorites = false;
        },
        error: async () => await this.handleRedirect('login')
      });
  }

  addProductToFavorites() {
    this.productsService
      .addProductToFavorites({
        productId: this.productId
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
          this.productInFavorites = true;
        },
        error: async () => await this.handleRedirect('login')
      });
  }

  deleteProduct() {
    this.deleteProductEvent.emit({
      productId: this.productId,
      fullName: this.deleteProductFullName
    });
    this.closeDeleteProductModal();
  }

  openDeleteProductModal(event: MouseEvent) {
    event.stopPropagation();
    this.showDeleteProductModal = true;
  }

  closeDeleteProductModal() {
    this.showDeleteProductModal = false;
    this.deleteProductFullName = '';
  }

  transformDate(date: Date) {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }

  translateCategory(category: string) {
    return `dropdown.${category}`;
  }

  translateSubcategory(category: string, subcategory: string) {
    return `dropdown.${category}Subcategory.${subcategory}`;
  }
}
