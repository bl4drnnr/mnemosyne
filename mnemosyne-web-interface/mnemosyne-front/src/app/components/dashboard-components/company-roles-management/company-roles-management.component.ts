import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoleScope } from '@interfaces/role-scope.type';
import { CreateCompanyRolePayload } from '@payloads/create-company-role.interface';
import { CompanyRoleType } from '@interfaces/company-role.type';
import { OneCompanyRoleType } from '@interfaces/one-company-role.type';
import { RolesService } from '@services/roles.service';
import { CompanyRoleDeletedResponse } from '@responses/company-role-deleted.enum';

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

  showRoleMoreInfoModal: boolean;
  currentRoleName: string;
  incorrectCurrentRoleName: boolean;
  currentRoleDescription: string;
  incorrectCurrentRoleDescription: boolean;
  currentRoleScopes: Array<RoleScope>;

  @Input() companyRoles: CompanyRoleType;
  @Output() createNewRoleEvent = new EventEmitter<CreateCompanyRolePayload>();
  @Output() getCompanyRoles = new EventEmitter<void>();
  @Output() deleteCompanyRole = new EventEmitter<string>();

  constructor(private readonly rolesService: RolesService) {}

  createNewRole() {
    this.createNewRoleEvent.emit({
      name: this.newRoleName,
      description: this.newRoleDescription,
      roleScopes: this.newRoleScopes
    });
  }

  deleteRole(roleName: string) {
    this.rolesService.deleteCompanyRole({ name: roleName }).subscribe({
      next: ({ message }) => {
        switch (message) {
          case CompanyRoleDeletedResponse.COMPANY_ROLE_DELETED:
            this.showRoleMoreInfoModal = false;
            this.currentRoleName = '';
            this.currentRoleDescription = '';
            this.currentRoleScopes = [];
            this.deleteCompanyRole.emit(message);
            this.getCompanyRoles.emit();
            break;
        }
      }
    });
  }

  showRoleMoreInfo(role: OneCompanyRoleType) {
    this.showRoleMoreInfoModal = true;
    this.currentRoleName = role.name;
    this.currentRoleDescription = role.description;
    this.currentRoleScopes = role.roleScopes;
  }

  closeRoleMoreInfoModal() {
    this.showRoleMoreInfoModal = false;
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

  fetchCompanyRoles() {
    this.getCompanyRoles.emit();
  }

  ngOnInit() {
    this.fetchCompanyRoles();
  }
}
