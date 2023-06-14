import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/components.module';
import { TermsAndConditionsComponent } from '@pages/terms-and-conditions/terms-and-conditions.component';

@NgModule({
  declarations: [TermsAndConditionsComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [TermsAndConditionsComponent]
})
export class StaticModule {}
