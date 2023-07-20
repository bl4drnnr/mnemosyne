import { Injectable } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.response';
import { Router } from '@angular/router';
import { UsersService } from '@services/users.service';
import { AuthenticationService } from '@services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokensService {
  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async handleLogout() {
    localStorage.removeItem('_at');
    await this.handleRedirect('login');
  }

  async refreshTokens() {
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

    return this.userInfo;
  }
}
