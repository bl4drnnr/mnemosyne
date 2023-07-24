import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CredentialsLayout } from '@layouts/credentials/credentials.layout';
import { RouterModule } from '@angular/router';
import { DefaultLayout } from '@layouts/default/default.layout';
import { EmptyLayout } from '@layouts/empty/empty.layout';
import { ComponentsModule } from '@components/components.module';
import { LottieComponent } from 'ngx-lottie';
import { TranslocoModule } from '@ngneat/transloco';
import {ModeToggleModule} from "@components/theme-toggle/theme-toggle.module";

const components = [DefaultLayout, EmptyLayout, CredentialsLayout];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    ComponentsModule,
    LottieComponent,
    TranslocoModule,
    ModeToggleModule
  ],
  exports: [...components]
})
export class LayoutsModule {}
