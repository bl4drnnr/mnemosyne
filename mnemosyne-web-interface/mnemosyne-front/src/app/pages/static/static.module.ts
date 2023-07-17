import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ComponentsModule } from '@components/components.module';
import { TermsAndConditionsComponent } from '@pages/terms-and-conditions/terms-and-conditions.component';
import { HomeComponent } from './home/home.component';
import { LottieComponent } from 'ngx-lottie';
import { NgxTypedJsModule } from 'ngx-typed-js';
import {TranslocoModule} from "@ngneat/transloco";

@NgModule({
  declarations: [TermsAndConditionsComponent, HomeComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    LottieComponent,
    NgxTypedJsModule,
    NgOptimizedImage,
    TranslocoModule
  ],
  exports: [TermsAndConditionsComponent]
})
export class StaticModule {}
