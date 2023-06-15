import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsLayout } from '@layouts/credentials/credentials.layout';
import { RouterModule } from '@angular/router';
import { DefaultLayout } from '@layouts/default/default.component';
import { EmptyLayout } from '@layouts/empty/empty.component';

const components = [DefaultLayout, EmptyLayout, CredentialsLayout];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, RouterModule],
  exports: [...components]
})
export class LayoutsModule {}
