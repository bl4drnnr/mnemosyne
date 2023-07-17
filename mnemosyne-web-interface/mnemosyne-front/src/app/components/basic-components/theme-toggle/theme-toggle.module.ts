import { NgModule } from '@angular/core';
import { ModeToggleService } from '@components/theme-toggle/theme-toggle.service';
import { ThemeToggleComponent } from '@components/theme-toggle/theme-toggle.component';
import {
  MODE_STORAGE_SERVICE,
  ModeLocalStorageService
} from '@components/theme-toggle/mode-storage.service';
import { NgIf, NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [ThemeToggleComponent],
  providers: [
    ModeToggleService,
    {
      provide: MODE_STORAGE_SERVICE,
      useClass: ModeLocalStorageService
    }
  ],
  imports: [NgIf, NgOptimizedImage],
  exports: [ThemeToggleComponent]
})
export class ModeToggleModule {}
