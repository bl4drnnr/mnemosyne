import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@components/button/button.component';
import { InputComponent } from '@components/input/input.component';
import { LinkComponent } from '@components/link/link.component';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    LinkComponent,
    GlobalMessageComponent,
    LoaderComponent
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    ButtonComponent,
    InputComponent,
    LinkComponent,
    GlobalMessageComponent,
    LoaderComponent
  ]
})
export class ComponentsModule {}
