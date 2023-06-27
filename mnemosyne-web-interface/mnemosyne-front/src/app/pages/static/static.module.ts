import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/components.module';
import { TermsAndConditionsComponent } from '@pages/terms-and-conditions/terms-and-conditions.component';
import { HomeComponent } from './home/home.component';
import { LottieComponent } from 'ngx-lottie';
import { NgxTypedJsModule } from 'ngx-typed-js';

@NgModule({
  declarations: [TermsAndConditionsComponent, HomeComponent],
  imports: [CommonModule, ComponentsModule, LottieComponent, NgxTypedJsModule],
  exports: [TermsAndConditionsComponent]
})
export class StaticModule {}
