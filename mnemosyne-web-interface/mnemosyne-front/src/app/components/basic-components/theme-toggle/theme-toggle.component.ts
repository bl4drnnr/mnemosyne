import { Component, OnInit } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { ModeToggleService } from '@components/theme-toggle/theme-toggle.service';

@Component({
  selector: 'basic-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {
  sunIcon: string;
  moonIcon: string;

  constructor(
    private readonly envService: EnvService,
    private modeToggleService: ModeToggleService
  ) {}

  staticStorageLink: string = this.envService.getStaticStorageLink;

  toggle() {
    this.modeToggleService.toggleMode();
  }

  ngOnInit() {
    this.moonIcon = `${this.staticStorageLink}/icons/moon.svg`;
    this.sunIcon = `${this.staticStorageLink}/icons/sun.svg`;
  }
}
