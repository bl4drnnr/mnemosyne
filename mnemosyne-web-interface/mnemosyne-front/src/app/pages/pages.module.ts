import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsModule } from '@pages/credentials.module';
import { StaticModule } from '@pages/static.module';
import { AccountModule } from '@pages/account.module';
import { MarketplaceModule } from '@pages/marketplace.module';

@NgModule({
  imports: [CommonModule],
  exports: [CredentialsModule, StaticModule, AccountModule, MarketplaceModule]
})
export class PagesModule {}
