import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() openSidebar = new EventEmitter<void>();

  scrolled = false;
  lastScrollPosition = 0;

  constructor(private readonly envService: EnvService) {}

  staticStorageLink = `${this.envService.getStaticStorageLink}`;

  @HostListener('window:scroll')
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset;

    this.scrolled = currentScrollPosition >= this.lastScrollPosition;

    this.lastScrollPosition = currentScrollPosition;
  }
}
