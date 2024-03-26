import * as dayjs from 'dayjs';
import { Component, Input } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { ProductCategory } from '@interfaces/product-category.type';
import { Currency } from '@interfaces/currency.type';
import { Router } from '@angular/router';

@Component({
  selector: 'page-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.scss']
})
export class ProductPreviewComponent {
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

  productPicturesBucket = `${this.envService.getStaticStorageLink}/products/`;
  uploadPictureIcon = `${this.envService.getStaticStorageLink}/icons/add-photo.svg`;

  constructor(
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
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
