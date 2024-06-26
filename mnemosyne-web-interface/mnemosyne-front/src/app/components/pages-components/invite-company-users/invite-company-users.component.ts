import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Role } from '@interfaces/role.type';
import { CompanyMembersType } from '@interfaces/company-members.type';
import { CompanyRolesType } from '@interfaces/company-roles.type';
import { RegistrationCompanyMemberInterface } from '@interfaces/registration-company-member.interface';
import { CompanyRoleType } from '@interfaces/company-role.type';
import { CustomCompanyMemberInterface } from '@interfaces/custom-company-member.interface';
import { AccountTranslation } from '@translations/account.enum';
import { TranslationService } from '@services/translation.service';

@Component({
  selector: 'page-component-invite-company-users',
  templateUrl: './invite-company-users.component.html',
  styleUrls: [
    './invite-company-users.component.scss',
    '../../../pages/credentials/shared/credentials.component.scss',
    '../../../components/basic-components/dropdown/dropdown.component.scss'
  ]
})
export class InviteCompanyUsersComponent implements OnInit {
  @Input() onWhite: boolean;
  @Input() companyRoles: CompanyRolesType;
  @Input() companyMembers: CompanyMembersType;
  @Input() companyCustomMembers: Array<CustomCompanyMemberInterface>;
  @Input() companyCustomRoles: CompanyRoleType;

  @Output() removeCompanyMember = new EventEmitter<string>();
  @Output() changeCompanyMemberRole =
    new EventEmitter<RegistrationCompanyMemberInterface>();
  @Output() changeCompanyMemberCustomRole =
    new EventEmitter<CustomCompanyMemberInterface>();

  defaultRolesTranslations: {
    DEFAULT: string;
    ADMIN: string;
    PRIMARY_ADMIN: string;
  };

  constructor(
    private readonly envService: EnvService,
    private readonly translationService: TranslationService
  ) {}

  closeButtonUrl = `${this.envService.getStaticStorageLink}/icons/close.svg`;

  removeMember(memberEmail: string) {
    this.removeCompanyMember.emit(memberEmail);
  }

  changeUserRole(email: string, roleKey: Role, roleValue: string) {
    this.changeCompanyMemberRole.emit({ email, roleKey, roleValue });

    this.companyMembers.forEach((member) => {
      if (member.email === email) member.isRoleDropDownOpen = false;
    });
  }

  changeUserCustomRole(email: string, roleId: string, roleName: string) {
    this.changeCompanyMemberCustomRole.emit({ email, roleId, roleName });

    this.companyCustomMembers.forEach((member) => {
      if (member.email === email) member.isRoleDropDownOpen = false;
    });
  }

  toggleDropdown(memberEmail: string) {
    this.companyMembers.forEach((member) => {
      if (member.email === memberEmail) {
        member.isRoleDropDownOpen = !member.isRoleDropDownOpen;
      }
    });
  }

  toggleCustomMembersDropdown(memberEmail: string) {
    this.companyCustomMembers.forEach((member) => {
      if (member.email === memberEmail) {
        member.isRoleDropDownOpen = !member.isRoleDropDownOpen;
      }
    });
  }

  removePrimaryRole() {
    return this.companyCustomRoles.filter(
      (role) => role.name !== 'PRIMARY_ADMIN'
    );
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

  async ngOnInit() {
    await this.translateRoles();
  }
}
