import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { ValidationService } from '@services/validation.service';
import { RegistrationPayload } from '@payloads/registration.payload';
import { PageTitleService } from '@services/page-title.service';
import { TitlesPages } from '@interfaces/titles.pages';

@Component({
  selector: 'page-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../shared/credentials.component.scss'],
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
export class RegistrationComponent implements OnInit {
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
    private readonly pageTitleService: PageTitleService,
    private readonly router: Router,
    public validationService: ValidationService
  ) {}

  ngOnInit() {
    this.pageTitleService.setPageTitle(TitlesPages.REGISTRATION);
  }

  handleRegistration() {
    if (this.wrongCredentials({ includeAll: true })) return;

    this.authenticationService
      .registration({
        email: this.email,
        password: this.password,
        tac: this.tac,
        firstName: this.firstName,
        lastName: this.lastName,
        website: this.website,
        location: this.location,
        company: this.company
      })
      .subscribe({
        next: () => (this.step = 3)
      });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  nextStep() {
    if (this.wrongCredentials({ includeAll: false })) return;
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
