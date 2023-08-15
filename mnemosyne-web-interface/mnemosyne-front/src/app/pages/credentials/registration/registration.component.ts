import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { ValidationService } from '@services/validation.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { WrongCredentialsInterface } from '@interfaces/wrong-credentials.interface';
import { RegistrationType } from '@interfaces/registration.type';
import { CompanyService } from '@services/company.service';
import { EnvService } from '@shared/env.service';
import { Role } from '@interfaces/role.enum';

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
  accRegistrationType: RegistrationType = 'start';

  step = 1;
  tac = false;

  email: string;
  password: string;

  firstName: string;
  lastName: string;

  companyLocation: string;
  companyName: string;
  companyWebsite: string;
  companyMembers: Array<{ email: string; role: string }> = [];
  companyRoles: Array<{ key: string; value: Role }>;
  companyMember: string;
  accountOwnerEmail: string;
  incorrectMemberEmail: boolean;
  incorrectCompanyName = true;
  incorrectLocationName = true;
  incorrectAccountOwnerEmail = true;

  incorrectEmail = true;
  incorrectPassword = true;
  incorrectFirstName: boolean;
  incorrectLastName: boolean;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly translationService: TranslationService,
    private readonly companyService: CompanyService,
    private readonly envService: EnvService,
    private readonly router: Router,
    public validationService: ValidationService
  ) {}

  closeButtonUrl = `${this.envService.getStaticStorageLink}/icons/close.svg`;

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
    const isEmailPresent = this.companyMembers.find(
      ({ email }) => email === this.companyMember
    );

    if (!this.incorrectMemberEmail && !isEmailPresent)
      this.companyMembers.push({
        email: this.companyMember,
        role: 'Read-only'
      });

    this.companyMember = '';
  }

  removeMember(memberEmail: string) {
    this.companyMembers = this.companyMembers.filter(
      ({ email }) => email !== memberEmail
    );
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.REGISTRATION);
  }
}
