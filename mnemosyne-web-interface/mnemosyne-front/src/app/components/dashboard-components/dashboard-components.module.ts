import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SecuritySettingsComponent } from '@components/security-settings/security-settings.component';
import { SecuritySettingSectionComponent } from '@components/security-settings/shared/security-setting-section/security-setting-section.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { UserInfoSettingsComponent } from '@components/user-info-settings/user-info-settings.component';
import { UserPhotoComponent } from '@components/user-photo/user-photo.component';
import { TranslocoModule } from '@ngneat/transloco';
import { BasicComponentsModule } from '@components/basic-components.module';
import { PagesComponentsModule } from '@components/pages-components.module';

const components = [
  SecuritySettingsComponent,
  SecuritySettingSectionComponent,
  SidebarComponent,
  UserInfoSettingsComponent,
  UserPhotoComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    TranslocoModule,
    BasicComponentsModule,
    NgOptimizedImage,
    PagesComponentsModule
  ],
  exports: [...components]
})
export class DashboardComponentsModule {}
