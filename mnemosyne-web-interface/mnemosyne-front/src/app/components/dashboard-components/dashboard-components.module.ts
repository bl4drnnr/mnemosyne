import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SecuritySettingsComponent } from '@components/security-settings/security-settings.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { UserInfoSettingsComponent } from '@components/user-info-settings/user-info-settings.component';
import { UserPhotoComponent } from '@components/user-photo/user-photo.component';
import { TranslocoModule } from '@ngneat/transloco';
import { BasicComponentsModule } from '@components/basic-components.module';
import { PagesComponentsModule } from '@components/pages-components.module';
import { CompanyInfoSettingsComponent } from '@components/company-info-settings/company-info-settings.component';
import { CompanyUsersSettingsComponent } from '@components/company-users-settings/company-users-settings.component';
import { CompanySecuritySettingsComponent } from '@components/company-security-settings/company-security-settings.component';
import { CompanyRolesManagementComponent } from '@components/company-roles-management/company-roles-management.component';
import { SecuritySettingSectionComponent } from '@components/shared/security-setting-section/security-setting-section.component';

const components = [
  SecuritySettingsComponent,
  SecuritySettingSectionComponent,
  SidebarComponent,
  UserInfoSettingsComponent,
  UserPhotoComponent,
  CompanyInfoSettingsComponent,
  CompanyUsersSettingsComponent,
  CompanySecuritySettingsComponent,
  CompanyRolesManagementComponent
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
