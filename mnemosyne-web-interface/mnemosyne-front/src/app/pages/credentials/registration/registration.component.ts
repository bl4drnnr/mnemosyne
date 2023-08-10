import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { ValidationService } from '@services/validation.service';
import { PageTitleService } from '@services/page-title.service';
import { TitlesPages } from '@interfaces/titles.pages';
import { WrongCredentialsInterface } from '@interfaces/wrong-credentials.interface';
import { RegistrationTypeInterface } from '@interfaces/registration-type.interface';
import { CompanyService } from '@services/company.service';

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
  accRegistrationType: RegistrationTypeInterface = 'start';

  step = 1;
  tac = false;

  email: string;
  password: string;

  firstName: string;
  lastName: string;

  companyLocation: string;
  companyName: string;
  companyWebsite: string;
  companyMembers: Array<string> = [];
  companyMember: string;
  accountOwnerEmail: string;
  incorrectCompanyName = true;
  incorrectLocationName = true;
  incorrectAccountOwnerEmail = true;

  incorrectEmail = true;
  incorrectPassword = true;
  incorrectFirstName: boolean;
  incorrectLastName: boolean;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly pageTitleService: PageTitleService,
    private readonly companyService: CompanyService,
    private readonly router: Router,
    public validationService: ValidationService
  ) {}

  handleCompanyRegistration() {
    if (this.wrongCompanyCredentials({ includeAll: true })) return;

    this.companyService
      .createCompanyAccount({
        companyName: this.companyName,
        companyLocation: this.companyLocation,
        companyWebsite: this.companyWebsite,
        accountOwnerEmail: this.accountOwnerEmail
      })
      .subscribe({
        next: () => (this.step = 3)
      });
  }

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

  nextCompanyStep() {
    if (this.wrongCompanyCredentials({ includeAll: false })) return;
    this.step++;
  }

  nextStep() {
    if (this.wrongCredentials({ includeAll: false })) return;
    this.step++;
  }

  backStep() {
    this.step--;
  }

  wrongCompanyCredentials({ includeAll }: WrongCredentialsInterface) {
    const wrongWebsite = !this.validationService.isFQDN(this.companyWebsite);
    const incorrectCompanyData =
      wrongWebsite ||
      this.incorrectCompanyName ||
      this.incorrectLocationName ||
      !this.companyWebsite;

    const incorrectAllCompanyData =
      incorrectCompanyData || this.incorrectAccountOwnerEmail;

    return !includeAll ? incorrectCompanyData : incorrectAllCompanyData;
  }

  wrongCredentials({ includeAll }: WrongCredentialsInterface) {
    const incorrectCredentials = this.incorrectPassword || this.incorrectEmail;
    const incorrectAllCredentials =
      incorrectCredentials ||
      !this.tac ||
      this.lastName.length < 1 ||
      this.firstName.length < 1 ||
      this.incorrectFirstName ||
      this.incorrectLastName;

    return !includeAll ? incorrectCredentials : incorrectAllCredentials;
  }

  addCompanyMember() {
    this.companyMembers.push(this.companyMember);
    this.companyMember = '';
  }

  ngOnInit() {
    this.pageTitleService.setPageTitle(TitlesPages.REGISTRATION);
  }
}
