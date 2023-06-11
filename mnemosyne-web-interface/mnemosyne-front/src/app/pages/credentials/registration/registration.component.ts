import { Component } from '@angular/core';

@Component({
  selector: 'page-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../credentials.component.scss']
})
export class RegistrationComponent {
  email: string;
  password: string;
  passwordRepeat: string;
  firstName: string;
  lastName: string;

  handleRegistration() {}
}
