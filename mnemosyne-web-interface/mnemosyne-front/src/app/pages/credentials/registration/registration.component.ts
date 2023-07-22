import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { ValidationService } from '@services/validation.service';

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

  firstName: string;
  lastName: string;
  location: string;
  company: string;
  website: string;

  incorrectEmail = true;
  incorrectPassword = true;
  incorrectFirstName: boolean;
  incorrectLastName: boolean;
  incorrectCompanyName: boolean;
  incorrectLocationName: boolean;

  constructor(
    private readonly authenticationService: AuthenticationService,
    public validationService: ValidationService,
    private readonly router: Router
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
      const wrongWebsite = !this.validationService.isFQDN(this.website);

      return (
        this.incorrectPassword ||
        this.incorrectEmail ||
        !this.tac ||
        this.lastName.length < 1 ||
        this.firstName.length < 1 ||
        this.incorrectFirstName ||
        this.incorrectLastName ||
        this.incorrectCompanyName ||
        this.incorrectLocationName ||
        wrongWebsite
      );
    }
  }
}
