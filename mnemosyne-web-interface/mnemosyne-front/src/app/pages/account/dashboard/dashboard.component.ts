import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    const accessToken = localStorage.getItem('_at');

    if (!accessToken) return await this.handleRedirect('login');

    this.authenticationService
      .refreshTokens({
        accessToken
      })
      .subscribe({
        next: ({ _at }) => {
          localStorage.setItem('_at', _at);
        },
        error: async () => {
          localStorage.removeItem('_at');
          await this.handleRedirect('login');
        }
      });
  }
}
