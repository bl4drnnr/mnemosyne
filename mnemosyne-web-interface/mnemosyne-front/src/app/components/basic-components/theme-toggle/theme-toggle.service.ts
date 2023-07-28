import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mode } from '@components/theme-toggle/theme-toggle.model';
import {
  MODE_STORAGE_SERVICE,
  ModeStorage
} from '@components/theme-toggle/mode-storage.service';

@Injectable()
export class ModeToggleService {
  private currentMode: Mode = Mode.LIGHT;
  private modeChangedSubject = new BehaviorSubject(this.currentMode);
  modeChanged$: Observable<Mode>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(MODE_STORAGE_SERVICE) private modeStorage: ModeStorage
  ) {
    this.modeChanged$ = this.modeChangedSubject.asObservable();
    this.init();
  }

  private updateCurrentMode(mode: Mode) {
    this.currentMode = mode;
    this.modeChangedSubject.next(this.currentMode);
    this.modeStorage.save(this.currentMode);
  }

  private init() {
    const deviceMode = window.matchMedia('(prefers-color-scheme: light)');
    let initMode = this.modeStorage.get();
    if (!initMode) {
      deviceMode.matches ? (initMode = Mode.DARK) : (initMode = Mode.LIGHT);
    }
    this.updateCurrentMode(initMode);
    this.document.body.classList.add(this.currentMode);
  }

  getCurrentMode() {
    return this.modeStorage.get();
  }

  toggleMode() {
    this.document.body.classList.toggle(Mode.LIGHT);
    this.document.body.classList.toggle(Mode.DARK);
    if (this.currentMode === Mode.LIGHT) {
      this.updateCurrentMode(Mode.DARK);
    } else {
      this.updateCurrentMode(Mode.LIGHT);
    }
  }
}
