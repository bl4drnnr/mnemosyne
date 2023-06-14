import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsModule } from '@pages/credentials.module';
import { StaticModule } from '@pages/static.module';

@NgModule({
  imports: [CommonModule],
  exports: [CredentialsModule, StaticModule]
})
export class PagesModule {}
