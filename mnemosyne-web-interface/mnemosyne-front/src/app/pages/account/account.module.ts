import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { ComponentsModule } from '@components/components.module';
import { SettingsComponent } from './settings/settings.component';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule, Routes } from '@angular/router';

const components = [DashboardComponent, SettingsComponent];

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
