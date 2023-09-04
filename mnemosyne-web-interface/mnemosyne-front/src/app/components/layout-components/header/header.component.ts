import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() showHeaderBurger = true;
  @Output() openSidebar = new EventEmitter<void>();

  scrolled = false;
  lastScrollPosition = 0;
  isUserLoggedIn = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  staticStorageLink = this.envService.getStaticStorageLink;

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  logout() {
    this.authenticationService.logout().subscribe({
      next: () => this.logoutUser(),
      error: () => this.logoutUser()
    });
  }

  async logoutUser() {
    localStorage.removeItem('_at');
    await this.handleRedirect('');
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset;
    this.scrolled = currentScrollPosition >= this.lastScrollPosition;
    this.lastScrollPosition = currentScrollPosition;
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('_at');
    this.isUserLoggedIn = !!accessToken;
  }
}
