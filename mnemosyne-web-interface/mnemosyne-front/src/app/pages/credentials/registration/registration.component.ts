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
  password = '';

  firstName: string;
  lastName: string;

  incorrectEmail = true;
  incorrectPassword = true;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  handleRegistration() {
    if (this.wrongCredentials({ includeAll: true })) return;

    this.authenticationService
      .registration({
        email: this.email,
        password: this.password,
        tac: this.tac,
        firstName: this.firstName,
        lastName: this.lastName
      })
      .subscribe({
        next: () => (this.step = 3)
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

  wrongCredentials({ includeAll }: { includeAll?: boolean }) {
    if (!includeAll) {
      return this.incorrectPassword || this.incorrectEmail;
    } else {
      return (
        this.incorrectPassword ||
        this.incorrectEmail ||
        !this.tac ||
        this.lastName.length < 1 ||
        this.firstName.length < 1
      );
    }
  }
}
