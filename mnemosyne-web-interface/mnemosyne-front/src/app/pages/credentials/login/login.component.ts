import { Component } from '@angular/core';

@Component({
  selector: 'page-login',
  templateUrl: './login.component.html',
  styleUrls: ['../credentials.component.scss']
})
export class LoginComponent {
  email: string;
  password: string;

  handleLogIn() {}
}
