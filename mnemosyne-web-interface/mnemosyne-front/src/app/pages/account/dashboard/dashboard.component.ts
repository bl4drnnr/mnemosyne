import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication.service';
import { Router } from '@angular/router';
import { UsersService } from '@services/users.service';
import { UserInfoResponse } from '@responses/user-info.response';

@Component({
  selector: 'layout-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userInfo: UserInfoResponse;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    private readonly router: Router
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async handleLogout() {
    localStorage.removeItem('_at');
    await this.handleRedirect('login');
  }

  async ngOnInit() {
    const accessToken = localStorage.getItem('_at');

    if (!accessToken) return await this.handleRedirect('login');

    this.usersService.getUserInfo({ accessToken }).subscribe({
      next: (userInfo) => (this.userInfo = userInfo),
      error: async () => await this.handleLogout()
    });

    this.authenticationService
      .refreshTokens({
        accessToken
      })
      .subscribe({
        next: ({ _at }) => localStorage.setItem('_at', _at),
        error: async () => await this.handleLogout()
      });
  }
}
