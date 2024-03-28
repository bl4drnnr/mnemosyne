import * as dayjs from 'dayjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { ProductCategory } from '@interfaces/product-category.type';
import { Currency } from '@interfaces/currency.type';
import { Router } from '@angular/router';
import { DeleteProductPayload } from '@payloads/delete-product.interface';

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
  @Input() location: string;
  @Input() contactPerson: string;
  @Input() contactPhone: string;
  @Input() createdAt: Date;
  @Input() showAdditionalInfo: boolean = false;
  @Input() showManagementButtons: boolean = false;

  @Output() deleteProductEvent = new EventEmitter<DeleteProductPayload>();

  productPicturesBucket = `${this.envService.getStaticStorageLink}/products/`;
  uploadPictureIcon = `${this.envService.getStaticStorageLink}/icons/add-photo.svg`;

  constructor(
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
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
