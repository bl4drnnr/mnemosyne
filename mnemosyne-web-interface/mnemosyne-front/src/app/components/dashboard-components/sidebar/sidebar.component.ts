import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class SidebarComponent {
  @Input() isSidebarOpen = false;
  @Input() userInfo: UserInfoResponse;
  @Output() closeSidebar = new EventEmitter<void>();

  staticStorageLink = this.envService.getStaticStorageLink;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  handleCloseSidebar() {
    this.isSidebarOpen = false;
    this.closeSidebar.emit();
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

  async handleRedirect(path: string, queryParams: any = {}) {
    await this.router.navigate([path], { queryParams });
  }
}
