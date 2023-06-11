import { Component } from '@angular/core';
import { AuthenticationService } from '@pages/shared/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'page-login',
  templateUrl: './login.component.html',
  styleUrls: ['../credentials.component.scss']
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
