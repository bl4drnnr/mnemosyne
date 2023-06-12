import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '@components/button/button.component';
import { InputComponent } from '@components/input/input.component';
import { LinkComponent } from '@components/link/link.component';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    LinkComponent,
    GlobalMessageComponent,
    LoaderComponent,
    CheckboxComponent
  ],
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  exports: [
    ButtonComponent,
    InputComponent,
    LinkComponent,
    GlobalMessageComponent,
    LoaderComponent,
    CheckboxComponent
  ]
})
export class ComponentsModule {}