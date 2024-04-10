import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersList } from '@interfaces/users-list.type';
import { CompanyMembersType } from '@interfaces/company-members.type';
import { GlobalMessageService } from '@shared/global-message.service';
import { CompanyRolesType } from '@interfaces/company-roles.type';
import { TranslationService } from '@services/translation.service';
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
import { AccountTranslation } from '@translations/account.enum';
import { CompanyRoleType } from '@interfaces/company-role.type';
import { CustomCompanyMemberInterface } from '@interfaces/custom-company-member.interface';

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
  @Input() query: string;
  @Input() totalItems: number;
  @Input() companyUsers: UsersList;
  @Input() companyCustomRoles: CompanyRoleType;
  @Input() readOnly: boolean;

  @Output() fetchCompanyUsers = new EventEmitter<void>();
  @Output() setNewCurrentPage = new EventEmitter<string>();
  @Output() setNewUsersPerPage = new EventEmitter<string>();
  @Output() setNewQuery = new EventEmitter<string>();
  @Output() inviteUsersToCompany = new EventEmitter<void>();
  @Output() saveCompanyMemberInformation =
    new EventEmitter<UpdateUserInfoPayload>();
  @Output() deleteCompanyMemberEvent = new EventEmitter<string>();

  showInviteUserModal: boolean;

  companyMember: string;
  companyMembers: CompanyMembersType = [];
  companyCustomMembers: Array<CustomCompanyMemberInterface> = [];
  companyRoles: CompanyRolesType;
  incorrectMemberEmail: boolean;

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

  defaultRolesTranslations: {
    DEFAULT: string;
    ADMIN: string;
    PRIMARY_ADMIN: string;
  };

  constructor(
    private readonly validationService: ValidationService,
    private readonly companyUsersService: CompanyUsersService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly phoneService: PhoneService,
    private readonly translationService: TranslationService
  ) {}

  async openInviteUserModal() {
    this.showInviteUserModal = true;
  }

  closeInviteUserModal() {
    this.companyCustomMembers = [];
    this.showInviteUserModal = false;
  }

  async addCompanyMember() {
    const isEmailPresent = this.companyCustomMembers.find(
      ({ email }) => email === this.companyMember
    );

    if (isEmailPresent) {
      await this.globalMessageService.handleWarning({
        message: 'member-already-on-list'
      });
    }

    const noPrimaryRole = this.companyCustomRoles.filter(
      (role) => role.name !== 'PRIMARY_ADMIN'
    );

    if (!this.incorrectMemberEmail) {
      this.companyCustomMembers.push({
        email: this.companyMember,
        roleId: noPrimaryRole[0].id,
        roleName: noPrimaryRole[0].name
      });
    }

    this.companyMember = '';
  }

  removeMember(memberEmail: string) {
    this.companyCustomMembers = this.companyCustomMembers.filter(
      ({ email }) => email !== memberEmail
    );
  }

  async changeUserCustomRole({
    email,
    roleId,
    roleName
  }: CustomCompanyMemberInterface) {
    const companyMemberIdx = this.companyCustomMembers.findIndex(
      (m) => m.email === email
    );
    this.companyCustomMembers[companyMemberIdx] = { email, roleId, roleName };
  }

  searchForCompanyMember(query: string) {
    this.setNewQuery.emit(query);
    this.fetchUsers();
  }

  inviteUsers() {
    console.log('this.companyCustomMembers', this.companyCustomMembers);
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

  translateRole(role: string) {
    if (role in this.defaultRolesTranslations)
      return this.defaultRolesTranslations[
        role as 'DEFAULT' | 'ADMIN' | 'PRIMARY_ADMIN'
      ];
    else return role;
  }

  async translateRoles() {
    this.defaultRolesTranslations =
      await this.translationService.translateObject(
        'defaultRoles',
        AccountTranslation.SETTINGS
      );
  }

  clearSmsCode() {
    this.phoneService.clearSmsCode().subscribe();
  }

  async ngOnInit() {
    this.fetchUsers();
    await this.translateRoles();
  }
}
