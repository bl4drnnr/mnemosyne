import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsModule } from '@pages/credentials.module';
import { StaticModule } from '@pages/static.module';
import { DashboardComponent } from './account/dashboard/dashboard.component';

@NgModule({
  imports: [CommonModule],
  exports: [CredentialsModule, StaticModule],
  declarations: [DashboardComponent]
})
export class PagesModule {}
