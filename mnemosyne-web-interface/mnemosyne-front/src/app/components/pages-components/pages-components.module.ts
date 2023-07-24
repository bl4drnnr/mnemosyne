import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AltRegistrationComponent } from '@components/alt-registration/alt-registration.component';
import { CreatePasswordComponent } from '@components/create-password/create-password.component';
import { MfaComponent } from '@components/mfa/mfa.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { TranslocoModule } from '@ngneat/transloco';

const components = [
  AltRegistrationComponent,
  CreatePasswordComponent,
  MfaComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    NgOptimizedImage,
    BasicComponentsModule,
    TranslocoModule
  ],
  exports: [...components]
})
export class PagesComponentsModule {}
