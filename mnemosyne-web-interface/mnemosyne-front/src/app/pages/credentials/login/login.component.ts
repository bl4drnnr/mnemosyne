import { Component } from '@angular/core';
import { AuthenticationService } from '@pages/shared/authentication.service';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'page-login',
  templateUrl: './login.component.html',
  styleUrls: ['../credentials.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0s', style({ opacity: 0 })),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent {
  email: string;
  password: string;
  incorrectCredentials: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  handleLogIn() {
    this.authenticationService
      .login({
        email: this.email,
        password: this.password
      })
      .subscribe(async () => {
        await this.router.navigate(['dashboard']);
      });
  }
}
