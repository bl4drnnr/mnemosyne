import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() showHeaderBurger = true;
  @Output() openSidebar = new EventEmitter<void>();

  scrolled = false;
  lastScrollPosition = 0;

  constructor(
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  staticStorageLink = `${this.envService.getStaticStorageLink}`;

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset;

    this.scrolled = currentScrollPosition >= this.lastScrollPosition;

    this.lastScrollPosition = currentScrollPosition;
  }
}
