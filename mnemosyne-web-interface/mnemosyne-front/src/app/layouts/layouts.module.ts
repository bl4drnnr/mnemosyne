import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from '@layouts/default/default.component';
import { EmptyComponent } from '@layouts/empty/empty.component';
import { CredentialsLayout } from '@layouts/credentials/credentials.layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DefaultComponent, EmptyComponent, CredentialsLayout],
  imports: [CommonModule, RouterModule],
  exports: [DefaultComponent, EmptyComponent, CredentialsLayout]
})
export class LayoutsModule {}
