import { Component, OnInit } from '@angular/core';
import { ProductsService } from '@services/products.service';
import { TranslationService } from '@services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetProductBySlug } from '@responses/get-product-by-slug.interface';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'page-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productSlug: string;
  product: GetProductBySlug;

  constructor(
    private readonly productsService: ProductsService,
    private readonly translationService: TranslationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

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

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
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
