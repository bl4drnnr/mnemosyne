import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponentsModule } from '@components/basic-components.module';
import { DashboardComponentsModule } from '@components/dashboard-components.module';
import { LayoutComponentsModule } from '@components/layout-components.module';
import { PagesComponentsModule } from '@components/pages-components.module';

@NgModule({
  exports: [
    BasicComponentsModule,
    DashboardComponentsModule,
    LayoutComponentsModule,
    PagesComponentsModule
  ],
  imports: [CommonModule]
})
export class ComponentsModule {}
