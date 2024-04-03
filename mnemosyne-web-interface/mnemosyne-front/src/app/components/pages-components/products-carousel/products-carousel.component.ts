import { Component, Input } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Router } from '@angular/router';
import { LatestProducts } from '@responses/get-latest-products.interface';

@Component({
  selector: 'page-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss']
})
export class ProductsCarouselComponent {
  @Input() products: Array<LatestProducts>;

  constructor(
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  productPicturesBucket = `${this.envService.getStaticStorageLink}/products/`;
  noProductPicture = `${this.envService.getStaticStorageLink}/icons/add-photo.svg`;

  responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  async handleRedirect(path: string, queryParams: any = {}) {
    await this.router.navigate([path], { queryParams });
  }

  translateCategory(category: string) {
    return `dropdown.${category}`;
  }

  translateSubcategory(category: string, subcategory: string) {
    return `dropdown.${category}Subcategory.${subcategory}`;
  }
}
