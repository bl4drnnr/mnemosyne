import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ComponentsModule } from '@components/components.module';
import { TermsAndConditionsComponent } from '@pages/terms-and-conditions/terms-and-conditions.component';
import { HomeComponent } from './home/home.component';
import { LottieComponent } from 'ngx-lottie';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { LayoutsModule } from '@layouts/layouts.module';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ContactComponent } from '@pages/contact/contact.component';
import { CarouselModule } from 'primeng/carousel';

const components = [
  TermsAndConditionsComponent,
  HomeComponent,
  ContactComponent
];

const routes: Routes = [
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    redirectTo: ''
  },
  {
    path: 'index',
    redirectTo: ''
  },
  {
    path: 'contact',
    component: ContactComponent
  }
];

@NgModule({
  declarations: [...components, ContactComponent],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    LottieComponent,
    NgxTypedJsModule,
    NgOptimizedImage,
    LayoutsModule,
    TranslocoModule,
    CarouselModule
  ],
  exports: [...components]
})
export class StaticModule {}
