import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersList } from '@interfaces/users-list.type';
import { CompanyMembersType } from '@interfaces/company-members.type';
import { GlobalMessageService } from '@shared/global-message.service';
import { Role } from '@interfaces/role.type';
import { CredentialsTranslation } from '@translations/credentials.enum';
import { CompanyRolesType } from '@interfaces/company-roles.type';
import { TranslationService } from '@services/translation.service';
import { RegistrationCompanyMemberInterface } from '@interfaces/registration-company-member.interface';
import { CompanyUsersService } from '@services/company-users.service';
import { CompanyMemberInfoResponse } from '@responses/company-member-info.interface';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { UpdateUserInfoPayload } from '@payloads/update-user-info.interface';
import { DeleteCompanyMemberPayload } from '@payloads/delete-company-member.interface';
import { CompanyMemberDeletedResponse } from '@responses/company-member-deleted.enum';
import { PhoneService } from '@services/phone.service';
import { ValidationService } from '@services/validation.service';
import { DefaultRoles } from '@interfaces/default-roles.enum';

@Component({
  selector: 'dashboard-company-users-settings',
  templateUrl: './company-users-settings.component.html',
  styleUrls: [
    './company-users-settings.component.scss',
    '../shared/security-setting-section/security-setting-section.component.scss'
  ],
  animations: [
    trigger('infoChangedAnimation', [
      state('void', style({ transform: 'translateY(-5px)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', animate('0.5s')),
      transition('* => void', animate('0.5s'))
    ])
  ]
})
export class CompanyUsersSettingsComponent implements OnInit {
  @Input() page: string;
  @Input() pageSize: string;
  @Input() totalItems: number;
  @Input() companyUsers: UsersList;

  @Output() fetchCompanyUsers = new EventEmitter<void>();
  @Output() setNewCurrentPage = new EventEmitter<string>();
  @Output() setNewUsersPerPage = new EventEmitter<string>();
  @Output() inviteUsersToCompany = new EventEmitter<void>();
  @Output() saveCompanyMemberInformation =
    new EventEmitter<UpdateUserInfoPayload>();
  @Output() deleteCompanyMemberEvent = new EventEmitter<string>();

  showInviteUserModal: boolean;

  companyMember: string;
  companyMembers: CompanyMembersType = [];
  companyRoles: CompanyRolesType;
  incorrectMemberEmail: boolean;
  companyMemberDefaultRoleValue: string;
  companyMemberDefaultRoleKey: Role;

  currentCompanyMember: CompanyMemberInfoResponse;
  currentCompanyMemberEmail: string;
  currentCompanyMemberFirstName: string;
  currentCompanyMemberLastName: string;
  currentCompanyMemberNamePronunciation: string;
  currentCompanyMemberHomeAddress: string;
  currentCompanyMemberHomePhone: string;
  currentCompanyMemberModal: boolean;
  incorrectCompanyMemberFirstName: boolean;
  incorrectCompanyMemberLastName: boolean;

  deleteCompanyMemberModal: boolean;
  deleteCompanyMemberMfaCode: string;
  deleteCompanyMemberPhoneCode: string;
  deleteCompanyMemberMfaRequired: boolean;
  deleteCompanyMemberPhoneRequired: boolean;
  deleteCompanyMemberPhoneCodeSent: boolean;

  constructor(
    private readonly validationService: ValidationService,
    private readonly companyUsersService: CompanyUsersService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly phoneService: PhoneService,
    private readonly translationService: TranslationService
  ) {}

  async openInviteUserModal() {
    this.showInviteUserModal = true;
    await this.initDefaultRoles();
  }

  closeInviteUserModal() {
    this.companyMembers = [];
    this.showInviteUserModal = false;
  }

  async addCompanyMember() {
    const isEmailPresent = this.companyMembers.find(
      ({ email }) => email === this.companyMember
    );

    if (isEmailPresent) {
      await this.globalMessageService.handleError({
        message: 'member-already-on-list'
      });
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

  async initDefaultRoles() {
    const roles: {
      primaryAdmin: string;
      admin: string;
      default: string;
    } = await this.translationService.translateObject(
      'roles',
      CredentialsTranslation.REGISTRATION
    );

    this.companyRoles = [
      {
        key: DefaultRoles.ADMIN,
        value: roles.admin
      },
      {
        key: DefaultRoles.DEFAULT,
        value: roles.default
      }
    ];

    this.companyMemberDefaultRoleValue = roles.default;
    this.companyMemberDefaultRoleKey = DefaultRoles.DEFAULT;
  }

  removeMember(memberEmail: string) {
    this.companyMembers = this.companyMembers.filter(
      ({ email }) => email !== memberEmail
    );
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
    await this.initDefaultRoles();
  }

  inviteUsers() {
    // @TODO Implement this function
  }

  fetchCompanyMemberInformation(memberId: string) {
    this.companyUsersService
      .getCompanyMemberInformation({
        memberId
      })
      .subscribe({
        next: (currentCompanyMember) => {
          this.currentCompanyMember = currentCompanyMember;
          this.currentCompanyMemberEmail = currentCompanyMember.email;
          this.currentCompanyMemberFirstName = currentCompanyMember.firstName;
          this.currentCompanyMemberLastName = currentCompanyMember.lastName;
          this.currentCompanyMemberNamePronunciation =
            currentCompanyMember.namePronunciation;
          this.currentCompanyMemberHomeAddress =
            currentCompanyMember.homeAddress;
          this.currentCompanyMemberHomePhone = currentCompanyMember.homePhone;
          this.currentCompanyMemberModal = true;
        }
      });
  }

  saveCompanyMemberInfo(memberId: string) {
    const namePronunciation = this.currentCompanyMemberNamePronunciation
      ? this.currentCompanyMemberNamePronunciation
      : null;
    const homeAddress = this.currentCompanyMemberHomeAddress
      ? this.currentCompanyMemberHomeAddress
      : null;
    const homePhone = this.currentCompanyMemberHomePhone
      ? this.currentCompanyMemberHomePhone
      : null;

    this.saveCompanyMemberInformation.emit({
      firstName: this.currentCompanyMemberFirstName,
      lastName: this.currentCompanyMemberLastName,
      namePronunciation,
      homeAddress,
      homePhone,
      memberId
    });

    this.fetchCompanyMemberInformation(memberId);
  }

  deleteCompanyMember(memberId: string) {
    const deleteCompanyMemberPayload: DeleteCompanyMemberPayload = {
      memberId
    };

    if (this.deleteCompanyMemberMfaCode?.length === 6)
      deleteCompanyMemberPayload.mfaCode = this.deleteCompanyMemberMfaCode;
    if (this.deleteCompanyMemberPhoneCode?.length === 6)
      deleteCompanyMemberPayload.phoneCode = this.deleteCompanyMemberPhoneCode;

    this.companyUsersService
      .deleteCompanyMember({ ...deleteCompanyMemberPayload })
      .subscribe({
        next: async ({ message }) => {
          switch (message) {
            case CompanyMemberDeletedResponse.FULL_MFA_REQUIRED:
              this.deleteCompanyMemberMfaRequired = true;
              this.deleteCompanyMemberPhoneRequired = true;
              this.deleteCompanyMemberPhoneCodeSent = true;
              break;
            case CompanyMemberDeletedResponse.PHONE_REQUIRED:
              this.deleteCompanyMemberPhoneRequired = true;
              this.deleteCompanyMemberPhoneCodeSent = true;
              break;
            case CompanyMemberDeletedResponse.TOKEN_TWO_FA_REQUIRED:
              this.deleteCompanyMemberMfaRequired = true;
              break;
            case CompanyMemberDeletedResponse.COMPANY_MEMBER_DELETED:
              this.closeCompanyMemberDeletionModal();
              this.deleteCompanyMemberEvent.emit(message);
              this.fetchCompanyUsers.emit();
              break;
          }
        }
      });

    this.deleteCompanyMemberModal = true;
  }

  wasInfoChanged() {
    const wasFirstNameChanged =
      this.currentCompanyMemberFirstName &&
      this.currentCompanyMemberFirstName !==
        this.currentCompanyMember.firstName;
    const wasLastNameChanged =
      this.currentCompanyMemberLastName &&
      this.currentCompanyMemberLastName !== this.currentCompanyMember.lastName;
    const wasNamePronChanged =
      this.currentCompanyMemberNamePronunciation !==
      this.currentCompanyMember.namePronunciation;
    const wasHomeAddressChanged =
      this.currentCompanyMemberHomeAddress !==
      this.currentCompanyMember.homeAddress;
    const wasHomePhoneChanged =
      this.currentCompanyMemberHomePhone !==
      this.currentCompanyMember.homePhone;

    return (
      wasFirstNameChanged ||
      wasLastNameChanged ||
      wasNamePronChanged ||
      wasHomeAddressChanged ||
      wasHomePhoneChanged
    );
  }

  incorrectUserData() {
    return (
      !this.currentCompanyMemberFirstName ||
      !this.currentCompanyMemberLastName ||
      this.incorrectCompanyMemberFirstName ||
      this.incorrectCompanyMemberLastName
    );
  }

  saveButtonDisabled() {
    return !this.wasInfoChanged() || this.incorrectUserData();
  }

  closeCompanyMemberDeletionModal() {
    if (this.deleteCompanyMemberPhoneRequired) this.clearSmsCode();

    this.deleteCompanyMemberModal = false;
    this.deleteCompanyMemberMfaCode = '';
    this.deleteCompanyMemberPhoneCode = '';
    this.deleteCompanyMemberMfaRequired = false;
    this.deleteCompanyMemberPhoneRequired = false;
    this.deleteCompanyMemberPhoneCodeSent = false;

    this.closeCompanyMemberInformationModal();
  }

  closeCompanyMemberInformationModal() {
    this.currentCompanyMemberEmail = '';
    this.currentCompanyMemberFirstName = '';
    this.currentCompanyMemberLastName = '';
    this.currentCompanyMemberNamePronunciation = '';
    this.currentCompanyMemberHomeAddress = '';
    this.currentCompanyMemberHomePhone = '';
    this.currentCompanyMemberModal = false;
  }

  disableDeleteCompanyMemberMfaButton() {
    return this.validationService.mfaButtonDisable({
      isPhoneRequired: this.deleteCompanyMemberPhoneRequired,
      isMfaRequired: this.deleteCompanyMemberMfaRequired,
      phoneCode: this.deleteCompanyMemberPhoneCode,
      mfaCode: this.deleteCompanyMemberMfaCode
    });
  }

  deleteCompanyMemberResendSmsCode() {
    this.phoneService.getSmsCode().subscribe({
      next: () => (this.deleteCompanyMemberPhoneCodeSent = true)
    });
  }

  setCurrentPage(currentPage: string) {
    this.setNewCurrentPage.emit(currentPage);
  }

  setUsersPerPage(usersPerPage: string) {
    this.setNewUsersPerPage.emit(usersPerPage);
  }

  fetchUsers() {
    this.fetchCompanyUsers.emit();
  }

  printUsersRoles(roles: Array<{ id: string; name: string }>) {
    return roles.map(({ name }) => name).join(', ');
  }

  clearSmsCode() {
    this.phoneService.clearSmsCode().subscribe();
  }

  ngOnInit() {
    this.fetchUsers();
  }
}
