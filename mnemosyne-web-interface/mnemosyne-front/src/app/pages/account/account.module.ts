import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { LayoutsModule } from '@layouts/layouts.module';

const components = [DashboardComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, LayoutsModule],
  exports: [...components]
})
export class AccountModule {}
