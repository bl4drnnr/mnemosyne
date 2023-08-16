import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Role } from '@interfaces/role.type';

@Component({
  selector: 'page-component-invite-company-users',
  templateUrl: './invite-company-users.component.html',
  styleUrls: [
    './invite-company-users.component.scss',
    '../../../pages/credentials/shared/credentials.component.scss'
  ]
})
export class InviteCompanyUsersComponent {
  @Input() companyRoles: Array<{ value: string; key: Role }>;
  @Input() companyMembers: Array<{ email: string; role: string }>;
  @Output() removeCompanyMember = new EventEmitter<string>();
  @Output() changeCompanyMemberRole = new EventEmitter<{
    memberEmail: string;
    role: Role;
  }>();

  isDropdownOpen = false;

  constructor(private readonly envService: EnvService) {}

  closeButtonUrl = `${this.envService.getStaticStorageLink}/icons/close.svg`;

  removeMember(memberEmail: string) {
    this.removeCompanyMember.emit(memberEmail);
  }

  changeUserRole(memberEmail: string, role: Role) {
    this.changeCompanyMemberRole.emit({ memberEmail, role });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
