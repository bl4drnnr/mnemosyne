import { NgModule } from '@angular/core';
import { ModeToggleService } from '@components/theme-toggle/theme-toggle.service';
import { ThemeToggleComponent } from '@components/theme-toggle/theme-toggle.component';
import {
  MODE_STORAGE_SERVICE,
  ModeLocalStorageService
} from '@components/theme-toggle/mode-storage.service';

@NgModule({
  declarations: [ThemeToggleComponent],
  providers: [
    ModeToggleService,
    {
      provide: MODE_STORAGE_SERVICE,
      useClass: ModeLocalStorageService
    }
  ],
  exports: [ThemeToggleComponent]
})
export class ModeToggleModule {}
