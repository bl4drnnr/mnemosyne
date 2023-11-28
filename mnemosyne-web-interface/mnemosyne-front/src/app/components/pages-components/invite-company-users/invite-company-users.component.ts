import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Role } from '@interfaces/role.type';
import { CompanyMembersType } from '@interfaces/company-members.type';
import { CompanyRolesType } from '@interfaces/company-roles.type';
import { RegistrationCompanyMemberInterface } from '@interfaces/registration-company-member.interface';

@Component({
  selector: 'page-component-invite-company-users',
  templateUrl: './invite-company-users.component.html',
  styleUrls: [
    './invite-company-users.component.scss',
    '../../../pages/credentials/shared/credentials.component.scss',
    '../../../components/basic-components/dropdown/dropdown.component.scss'
  ]
})
export class InviteCompanyUsersComponent {
  @Input() onWhite: boolean;
  @Input() companyRoles: CompanyRolesType;
  @Input() companyMembers: CompanyMembersType;
  @Output() removeCompanyMember = new EventEmitter<string>();
  @Output() changeCompanyMemberRole =
    new EventEmitter<RegistrationCompanyMemberInterface>();

  constructor(private readonly envService: EnvService) {}

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

  toggleDropdown(memberEmail: string) {
    this.companyMembers.forEach((member) => {
      if (member.email === memberEmail) {
        member.isRoleDropDownOpen = !member.isRoleDropDownOpen;
      }
    });
  }
}
