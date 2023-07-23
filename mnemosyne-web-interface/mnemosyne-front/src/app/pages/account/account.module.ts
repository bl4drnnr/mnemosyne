import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { ComponentsModule } from '@components/components.module';
import { SettingsComponent } from './settings/settings.component';
import { TranslocoModule } from '@ngneat/transloco';

const components = [DashboardComponent, SettingsComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, LayoutsModule, ComponentsModule, TranslocoModule],
  exports: [...components]
})
export class AccountModule {}
