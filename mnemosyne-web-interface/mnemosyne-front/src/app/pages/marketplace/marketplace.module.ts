import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MarketplaceComponent } from '@pages/marketplace/marketplace.component';
import { ComponentsModule } from '@components/components.module';
import { LayoutsModule } from '@layouts/layouts.module';
import { TranslocoModule } from '@ngneat/transloco';
import { ProductComponent } from '@pages/product/product.component';
import { CreateProductComponent } from '@pages/create-product/create-product.component';
import { ProductNotFoundComponent } from '@pages/product-not-found/product-not-found.component';

const components = [
  MarketplaceComponent,
  ProductComponent,
  CreateProductComponent,
  ProductNotFoundComponent
];

const routes: Routes = [
  {
    path: 'marketplace',
    component: MarketplaceComponent
  },
  {
    path: 'marketplace/product/:product-slug',
    component: ProductComponent
  },
  {
    path: 'marketplace/create-product',
    component: CreateProductComponent
  },
  {
    path: 'marketplace/product-not-found',
    component: ProductNotFoundComponent
  }
];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forRoot(routes),
    ComponentsModule,
    CommonModule,
    NgOptimizedImage,
    LayoutsModule,
    TranslocoModule
  ],
  exports: [...components]
})
export class MarketplaceModule {}
