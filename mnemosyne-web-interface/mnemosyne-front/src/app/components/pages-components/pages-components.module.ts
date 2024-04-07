import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AltRegistrationComponent } from '@components/alt-registration/alt-registration.component';
import { CreatePasswordComponent } from '@components/create-password/create-password.component';
import { CreateMfaComponent } from '@components/create-mfa/create-mfa.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { TranslocoModule } from '@ngneat/transloco';
import { RecoveryKeysComponent } from './recovery-keys/recovery-keys.component';
import { InviteCompanyUsersComponent } from './invite-company-users/invite-company-users.component';
import { UploadProductPictureComponent } from '@components/upload-product-picture/upload-product-picture.component';
import { ProductPreviewComponent } from '@components/product-preview/product-preview.component';
import { ProductsModalSearchComponent } from '@components/products-modal-search/products-modal-search.component';
import { ProductsCarouselComponent } from '@components/products-carousel/products-carousel.component';
import { CarouselModule } from 'primeng/carousel';
import { MarketplaceProductListComponent } from '@components/marketplace-product-list/marketplace-product-list.component';

const components = [
  AltRegistrationComponent,
  CreatePasswordComponent,
  CreateMfaComponent,
  RecoveryKeysComponent,
  InviteCompanyUsersComponent,
  UploadProductPictureComponent,
  ProductPreviewComponent,
  ProductsModalSearchComponent,
  ProductsCarouselComponent,
  MarketplaceProductListComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    NgOptimizedImage,
    BasicComponentsModule,
    TranslocoModule,
    CarouselModule
  ],
  exports: [...components]
})
export class PagesComponentsModule {}
