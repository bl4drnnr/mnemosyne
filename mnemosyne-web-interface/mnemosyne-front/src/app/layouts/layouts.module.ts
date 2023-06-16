import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CredentialsLayout } from '@layouts/credentials/credentials.layout';
import { RouterModule } from '@angular/router';
import { DefaultLayout } from '@layouts/default/default.component';
import { EmptyLayout } from '@layouts/empty/empty.component';
import { ComponentsModule } from '@components/components.module';

const components = [DefaultLayout, EmptyLayout, CredentialsLayout];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, RouterModule, NgOptimizedImage, ComponentsModule],
  exports: [...components]
})
export class LayoutsModule {}
