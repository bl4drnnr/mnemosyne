import { Injectable, InjectionToken } from '@angular/core';
import { Mode } from '@components/theme-toggle/theme-toggle.model';

export const MODE_STORAGE_SERVICE = new InjectionToken<ModeStorage>(
  'MODE_STORAGE'
);

export interface ModeStorage {
  save(mode: Mode): void;
  get(): Mode;
}

@Injectable()
export class ModeLocalStorageService implements ModeStorage {
  LOCAL_STORAGE_KEY = 'mode';

  save(mode: Mode): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, mode.toString());
  }

  get(): Mode {
    return <Mode>localStorage.getItem(this.LOCAL_STORAGE_KEY) || undefined;
  }
}
