import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FooterComponent } from '@components/footer/footer.component';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';
import { HeaderComponent } from '@components/header/header.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { TranslocoModule } from '@ngneat/transloco';
import { BasicComponentsModule } from '@components/basic-components.module';
import { ModeToggleModule } from '@components/theme-toggle/theme-toggle.module';
import { PagesComponentsModule } from '@components/pages-components.module';

const components = [
  FooterComponent,
  GlobalMessageComponent,
  HeaderComponent,
  LoaderComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    NgOptimizedImage,
    TranslocoModule,
    BasicComponentsModule,
    ModeToggleModule,
    PagesComponentsModule
  ],
  exports: [...components]
})
export class LayoutComponentsModule {}
