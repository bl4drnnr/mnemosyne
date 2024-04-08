import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { ComponentsModule } from '@components/components.module';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from '@pages/favorites/favorites.component';
import { SettingsComponent } from '@pages/settings/settings.component';
import { CompanyProductsSettingsComponent } from '@pages/company-products-settings/company-products-settings.component';
import { CompanySettingsComponent } from '@pages/company-settings/company-settings.component';

const components = [
  DashboardComponent,
  SettingsComponent,
  FavoritesComponent,
  CompanySettingsComponent,
  CompanyProductsSettingsComponent
];

const router: Routes = [
  {
    path: 'account/dashboard',
    component: DashboardComponent
  },
  {
    path: 'account/settings',
    component: SettingsComponent
  },
  {
    path: 'account',
    redirectTo: 'account/dashboard'
  },
  {
    path: 'account/favorites',
    component: FavoritesComponent
  },
  {
    path: 'company/company-settings',
    component: CompanySettingsComponent
  },
  {
    path: 'company/company-products',
    component: CompanyProductsSettingsComponent
  }
];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forRoot(router),
    CommonModule,
    LayoutsModule,
    ComponentsModule,
    TranslocoModule,
    NgOptimizedImage
  ],
  exports: [...components]
})
export class AccountModule {}
