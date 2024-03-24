import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { ProductsService } from '@services/products.service';
import { Titles } from '@interfaces/titles.enum';
import { GetProductBySlug } from '@responses/get-product-by-slug.interface';

@Component({
  selector: 'page-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['../shared/create-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productSlug: string;
  product: GetProductBySlug;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService
  ) {}

  getProductBySlugToEdit() {
    this.productsService
      .getProductBySlugToEdit({
        slug: this.productSlug
      })
      .subscribe({
        next: ({ product }) => {
          this.product = product;
          this.translationService.setPageTitle(Titles.EDIT_PRODUCT, {
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
        this.getProductBySlugToEdit();
      }
    });
  }
}
