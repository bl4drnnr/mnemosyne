import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { MarketplaceComponent } from '@pages/marketplace/marketplace.component';
import { ComponentsModule } from '@components/components.module';
import { LayoutsModule } from '@layouts/layouts.module';
import { TranslocoModule } from '@ngneat/transloco';
import { ProductComponent } from '@pages/product/product.component';
import { CreateProductComponent } from '@pages/create-product/create-product.component';
import { ProductNotFoundComponent } from '@pages/product-not-found/product-not-found.component';
import { EditProductComponent } from '@pages/edit-product/edit-product.component';
import { MarketplaceUserComponent } from '@pages/marketplace-user/marketplace-user.component';
import { MarketplaceCompanyComponent } from '@pages/marketplace-company/marketplace-company.component';

const components = [
  MarketplaceComponent,
  ProductComponent,
  CreateProductComponent,
  ProductNotFoundComponent,
  EditProductComponent,
  MarketplaceUserComponent,
  MarketplaceCompanyComponent
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
  },
  {
    path: 'marketplace/product/:product-slug/edit',
    component: EditProductComponent
  },
  {
    path: 'marketplace/user/:userId',
    component: MarketplaceUserComponent
  },
  {
    path: 'marketplace/company/:companyId',
    component: MarketplaceCompanyComponent
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
    TranslocoModule,
    CarouselModule
  ],
  exports: [...components]
})
export class MarketplaceModule {}
