import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from '@pages/shared/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'page-registration',
  templateUrl: './registration.component.html',
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
export class RegistrationComponent {
  step = 1;
  tac = false;

  email: string;
  password: string;
  passwordRepeat: string;

  firstName: string;
  lastName: string;
  phoneNumber: string;

  incorrectEmail: boolean;
  incorrectPassword: boolean;
  passwordErrors: Array<{ error: boolean; text: string }>;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  handleRegistration() {
    if (this.isAllCredentialsCorrect()) return;

    this.authenticationService
      .registration({
        email: this.email,
        password: this.passwordRepeat,
        tac: this.tac,
        phoneNumber: this.phoneNumber,
        firstName: this.firstName,
        lastName: this.lastName
      })
      .subscribe(() => {
        this.step = 3;
      });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  nextStep() {
    this.step++;
  }

  backStep() {
    this.step--;
  }

  isAllCredentialsCorrect(includeAll = false) {
    if (includeAll) {
      return (
        !this.email ||
        !this.password ||
        this.password !== this.passwordRepeat ||
        this.incorrectEmail ||
        this.incorrectPassword ||
        !this.tac ||
        !this.phoneNumber ||
        !this.firstName ||
        !this.lastName
      );
    } else {
      return (
        !this.email ||
        !this.password ||
        this.password !== this.passwordRepeat ||
        this.incorrectEmail ||
        this.incorrectPassword
      );
    }
  }
}
