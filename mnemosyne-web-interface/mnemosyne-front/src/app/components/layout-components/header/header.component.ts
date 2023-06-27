import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  scrolled = false;
  lastScrollPosition = 0;

  @HostListener('window:scroll')
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset;

    this.scrolled = currentScrollPosition >= this.lastScrollPosition;

    this.lastScrollPosition = currentScrollPosition;
  }
}
