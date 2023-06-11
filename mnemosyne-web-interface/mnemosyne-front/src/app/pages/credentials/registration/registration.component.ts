import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'page-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../credentials.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0s', style({ opacity: 0 })),
        animate('0.5s ease-in-out', style({ opacity: 1 })),
      ]),
    ])
  ]
})
export class RegistrationComponent {
  step = 1;

  email: string;
  password: string;
  passwordRepeat: string;

  firstName: string;
  lastName: string;

  incorrectEmail: boolean;
  incorrectPassword: boolean;
  passwordErrors: Array<{ error: boolean; text: string }>;

  handleRegistration() {}

  nextStep() {
    this.step++;
  }

  backStep() {
    this.step--;
  }

  isAllCredentialsCorrect() {
    return (
      !this.email ||
      !this.password ||
      this.password !== this.passwordRepeat ||
      this.incorrectEmail ||
      this.incorrectPassword
    );
  }
}
