import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RoleScope } from '@interfaces/role-scope.type';
import { CreateCompanyRolePayload } from '@payloads/create-company-role.interface';

@Component({
  selector: 'dashboard-company-roles-management',
  templateUrl: './company-roles-management.component.html',
  styleUrls: [
    './company-roles-management.component.scss',
    '../shared/security-setting-section/security-setting-section.component.scss'
  ]
})
export class CompanyRolesManagementComponent implements OnInit {
  newRoleName: string;
  incorrectNewRoleName: boolean;
  newRoleDescription: string;
  incorrectNewRoleDescription: boolean;
  newRoleScopes: Array<RoleScope> = [];
  showCreateNewRoleModal: boolean;

  @Output() createNewRoleEvent = new EventEmitter<CreateCompanyRolePayload>();

  createNewRole() {
    this.createNewRoleEvent.emit({
      name: this.newRoleName,
      description: this.newRoleDescription,
      roleScopes: this.newRoleScopes
    });
  }

  fetchCompanyRoles() {
    // @TODO Implement this function
  }

  pushNewRoleScope(scope: RoleScope) {
    if (!this.newRoleScopes.includes(scope)) this.newRoleScopes.push(scope);
    else this.newRoleScopes = this.newRoleScopes.filter((s) => s !== scope);
  }

  disableCreateNewRoleButton() {
    return (
      !this.newRoleName ||
      !this.newRoleDescription ||
      this.incorrectNewRoleName ||
      this.incorrectNewRoleDescription ||
      this.newRoleScopes.length === 0
    );
  }

  openCreateNewRoleModal() {
    this.showCreateNewRoleModal = true;
  }

  closeCreateNewRoleModal() {
    this.newRoleName = '';
    this.newRoleDescription = '';
    this.newRoleScopes = [];
    this.showCreateNewRoleModal = false;
  }

  ngOnInit() {}
}
