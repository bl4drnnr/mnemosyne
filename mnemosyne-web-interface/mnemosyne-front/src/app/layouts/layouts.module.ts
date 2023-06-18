import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CredentialsLayout } from '@layouts/credentials/credentials.layout';
import { RouterModule } from '@angular/router';
import { DefaultLayout } from '@layouts/default/default.component';
import { EmptyLayout } from '@layouts/empty/empty.component';
import { ComponentsModule } from '@components/components.module';
import {LottieComponent} from "ngx-lottie";

const components = [DefaultLayout, EmptyLayout, CredentialsLayout];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, RouterModule, NgOptimizedImage, ComponentsModule, LottieComponent],
  exports: [...components]
})
export class LayoutsModule {}
