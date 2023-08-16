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
import { CredentialsTranslation } from '@translations/credentials.enum';
import { Role } from '@interfaces/role.type';
import { Roles } from '@interfaces/roles.enum';
import { CompanyMembersType } from '@interfaces/company-members.type';
import { CompanyRolesType } from '@interfaces/company-roles.type';
import { RegistrationCompanyMemberInterface } from '@interfaces/registration-company-member.interface';
import { GlobalMessageService } from '@shared/global-message.service';

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
  companyMembers: CompanyMembersType = [];
  companyRoles: CompanyRolesType;
  companyMember: string;
  companyMemberDefaultRoleValue: string;
  companyMemberDefaultRoleKey: Role;
  companyMembersLimit = 5;
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
    private readonly globalMessageService: GlobalMessageService,
    private readonly authenticationService: AuthenticationService,
    private readonly translationService: TranslationService,
    private readonly companyService: CompanyService,
    private readonly router: Router,
    public validationService: ValidationService
  ) {}

  handleCompanyRegistration() {
    if (this.wrongCompanyCredentials({ includeAll: true })) return;

    const companyMembers = this.companyMembers.map((member) => {
      return { email: member.email, role: member.roleKey };
    });

    this.companyService
      .createCompanyAccount({
        companyName: this.companyName,
        companyLocation: this.companyLocation,
        companyWebsite: this.companyWebsite,
        accountOwnerEmail: this.accountOwnerEmail,
        companyMembers
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

  async addCompanyMember() {
    if (this.companyMembersLimit === this.companyMembers.length) {
      return await this.companyMembersLimitReached();
    }

    const isEmailPresent = this.isMemberEmailPresent(this.companyMember);

    if (isEmailPresent) {
      return await this.memberAlreadyOnList();
    }

    if (!this.incorrectMemberEmail) {
      this.companyMembers.push({
        email: this.companyMember,
        roleKey: this.companyMemberDefaultRoleKey,
        roleValue: this.companyMemberDefaultRoleValue
      });
    }

    this.companyMember = '';
  }

  removeMember(memberEmail: string) {
    this.companyMembers = this.companyMembers.filter(
      ({ email }) => email !== memberEmail
    );
  }

  async assignAccountOwner(accountOwnerEmail: string) {
    this.accountOwnerEmail = accountOwnerEmail;

    const isEmailPresent = this.isMemberEmailPresent(accountOwnerEmail);

    if (isEmailPresent) {
      this.accountOwnerEmail = '';
      return await this.memberAlreadyOnList();
    }
  }

  async changeUserRole({
    email,
    roleKey,
    roleValue
  }: RegistrationCompanyMemberInterface) {
    const companyMemberIdx = this.companyMembers.findIndex(
      (m) => m.email === email
    );
    this.companyMembers[companyMemberIdx] = { email, roleKey, roleValue };
    await this.setRoles();
  }

  async companyMembersLimitReached() {
    const message = await this.translationService.translateText(
      'companyMembersLimitReached',
      CredentialsTranslation.REGISTRATION
    );

    this.globalMessageService.handle({
      message,
      isError: true
    });
  }

  async memberAlreadyOnList() {
    const message = await this.translationService.translateText(
      'memberAlreadyOnList',
      CredentialsTranslation.REGISTRATION
    );

    this.globalMessageService.handle({
      message,
      isError: true
    });
  }

  isMemberEmailPresent(memberEmail: string) {
    return this.companyMembers.find(({ email }) => email === memberEmail);
  }

  wrongCompanyCredentials({ includeAll }: WrongCredentialsInterface) {
    const wrongWebsite = !this.validationService.isFQDN(this.companyWebsite);

    const incorrectCompanyData =
      wrongWebsite ||
      this.incorrectCompanyName ||
      this.incorrectLocationName ||
      !this.companyWebsite;

    const incorrectOwnerData =
      !this.accountOwnerEmail || this.incorrectAccountOwnerEmail;

    const incorrectAllCompanyData = incorrectCompanyData || incorrectOwnerData;

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

  async setRoles() {
    const roles: {
      primaryAdmin: string;
      admin: string;
      default: string;
      readOnly: string;
    } = await this.translationService.translateObject(
      'roles',
      CredentialsTranslation.REGISTRATION
    );

    this.companyRoles = [
      {
        key: Roles.ADMIN,
        value: roles.admin
      },
      {
        key: Roles.DEFAULT,
        value: roles.default
      },
      {
        key: Roles.READ_ONLY,
        value: roles.readOnly
      }
    ];

    this.companyMemberDefaultRoleValue = roles.default;
    this.companyMemberDefaultRoleKey = Roles.DEFAULT;
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.REGISTRATION);
    await this.setRoles();
  }
}
