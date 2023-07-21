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
  password = '';

  firstName = '';
  lastName = '';
  location = '';
  company = '';
  website = '';

  incorrectEmail = true;
  incorrectPassword = true;

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
      const wrongCompanyName = this.isCompanyNameWrong();
      const wrongLocation = this.isLocationWrong();
      const wrongFirstName = this.isFirstNameWrong();
      const wrongLastName = this.isLastNameWrong();
      const wrongWebsite = !this.validationService.isFQDN(this.website);

      return (
        this.incorrectPassword ||
        this.incorrectEmail ||
        !this.tac ||
        this.lastName.length < 1 ||
        this.firstName.length < 1 ||
        wrongFirstName ||
        wrongLastName ||
        wrongCompanyName ||
        wrongWebsite ||
        wrongLocation
      );
    }
  }

  isCompanyNameWrong() {
    return !this.validationService.checkLength({
      str: this.company,
      min: 2,
      max: 64
    });
  }

  isLocationWrong() {
    return !this.validationService.checkLength({
      str: this.location,
      min: 8,
      max: 128
    });
  }

  isFirstNameWrong() {
    return !this.validationService.checkLength({
      str: this.firstName,
      max: 64
    });
  }

  isLastNameWrong() {
    return !this.validationService.checkLength({
      str: this.lastName,
      max: 64
    });
  }
}
