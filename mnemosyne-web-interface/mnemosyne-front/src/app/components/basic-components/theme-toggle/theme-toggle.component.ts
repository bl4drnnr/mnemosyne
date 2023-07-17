import { Component, OnInit } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { ModeToggleService } from '@components/theme-toggle/theme-toggle.service';
import { Mode } from '@components/theme-toggle/theme-toggle.model';

@Component({
  selector: 'basic-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {
  protected readonly Mode = Mode;
  sunIcon: string;
  moonIcon: string;
  currentMode: string;

  constructor(
    private readonly envService: EnvService,
    private modeToggleService: ModeToggleService
  ) {}

  staticStorageLink: string = this.envService.getStaticStorageLink;

  toggle() {
    this.modeToggleService.toggleMode();
    this.currentMode = this.modeToggleService.getCurrentMode();
  }

  ngOnInit() {
    this.moonIcon = `${this.staticStorageLink}/icons/moon.svg`;
    this.sunIcon = `${this.staticStorageLink}/icons/sun.svg`;
  }
}
