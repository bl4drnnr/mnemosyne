import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersList } from '@interfaces/users-list.type';
import { CompanyMembersType } from '@interfaces/company-members.type';
import { GlobalMessageService } from '@shared/global-message.service';
import { Role } from '@interfaces/role.type';
import { CredentialsTranslation } from '@translations/credentials.enum';
import { Roles } from '@interfaces/roles.enum';
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

@Component({
  selector: 'dashboard-company-users-settings',
  templateUrl: './company-users-settings.component.html',
  styleUrls: ['./company-users-settings.component.scss'],
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

  constructor(
    private readonly companyUsersService: CompanyUsersService,
    private readonly globalMessageService: GlobalMessageService,
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
        key: Roles.ADMIN,
        value: roles.admin
      },
      {
        key: Roles.DEFAULT,
        value: roles.default
      }
    ];

    this.companyMemberDefaultRoleValue = roles.default;
    this.companyMemberDefaultRoleKey = Roles.DEFAULT;
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
    //
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

  saveCompanyMemberInfo() {
    //
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

  closeCompanyMemberInformationModal() {
    this.currentCompanyMemberEmail = '';
    this.currentCompanyMemberFirstName = '';
    this.currentCompanyMemberLastName = '';
    this.currentCompanyMemberNamePronunciation = '';
    this.currentCompanyMemberHomeAddress = '';
    this.currentCompanyMemberHomePhone = '';
    this.currentCompanyMemberModal = false;
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

  printUsersRoles(roles: Array<{ id: string; value: string }>) {
    return roles.map(({ value }) => value).join(', ');
  }

  ngOnInit() {
    this.fetchUsers();
  }
}
