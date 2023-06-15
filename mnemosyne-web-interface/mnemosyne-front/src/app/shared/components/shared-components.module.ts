import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/components/header/header.component';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { RouterModule } from '@angular/router';

const components = [HeaderComponent, SidebarComponent, FooterComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, RouterModule],
  exports: [...components]
})
export class SharedComponentsModule {}
