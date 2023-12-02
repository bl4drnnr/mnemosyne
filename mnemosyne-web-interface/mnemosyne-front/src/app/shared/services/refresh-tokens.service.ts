import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '@services/users.service';
import { AuthenticationService } from '@services/authentication.service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokensService {
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

    if (!accessToken) return this.handleLogout();

    return this.authenticationService.refreshTokens().pipe(
      switchMap(({ _at }) => {
        localStorage.setItem('_at', _at);
        return this.usersService.getUserInfo();
      })
    );
  }
}
