import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoleScope } from '@interfaces/role-scope.type';
import { CreateCompanyRolePayload } from '@payloads/create-company-role.interface';
import { CompanyRoleType } from '@interfaces/company-role.type';
import { OneCompanyRoleType } from '@interfaces/one-company-role.type';
import { Scopes } from '@interfaces/role-scopes.enum';
import { UpdateCompanyRolePayload } from '@payloads/update-company-role.interface';
import { UtilsService } from '@services/utils.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { CompanyUsersService } from '@services/company-users.service';

@Component({
  selector: 'dashboard-company-roles-management',
  templateUrl: './company-roles-management.component.html',
  styleUrls: [
    './company-roles-management.component.scss',
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
export class CompanyRolesManagementComponent implements OnInit {
  showCreateNewRoleModal: boolean;
  newRoleName: string;
  incorrectNewRoleName: boolean;
  newRoleDescription: string;
  incorrectNewRoleDescription: boolean;
  newRoleScopes: Array<RoleScope> = [];
  newRoleMemberQuery: string = '';
  newRoleMembers: Array<{ id: string; email: string }> = [];
  newRoleFoundMembers: Array<{ id: string; email: string }> = [];

  showRoleMoreInfoModal: boolean;
  currentRole: OneCompanyRoleType;
  currentRoleName: string;
  incorrectCurrentRoleName: boolean;
  currentRoleDescription: string;
  incorrectCurrentRoleDescription: boolean;
  currentRoleUsersManagementScope: boolean;
  currentRoleRolesManagementScope: boolean;
  currentRoleCompanyInfoManagementScope: boolean;

  @Input() companyRoles: CompanyRoleType;
  @Output() createNewRoleEvent = new EventEmitter<CreateCompanyRolePayload>();
  @Output() getCompanyRoles = new EventEmitter<void>();
  @Output() deleteCompanyRole = new EventEmitter<string>();
  @Output() updateRole = new EventEmitter<UpdateCompanyRolePayload>();

  constructor(
    private readonly utilsService: UtilsService,
    private readonly companyUsersService: CompanyUsersService
  ) {}

  createNewRole() {
    this.createNewRoleEvent.emit({
      name: this.newRoleName,
      description: this.newRoleDescription,
      roleScopes: this.newRoleScopes
    });
  }

  saveRoleChanges() {
    const roleScopes = this.transformScopesToArray();

    this.updateRole.emit({
      name: this.currentRoleName,
      description: this.currentRoleDescription,
      roleScopes
    });

    this.closeRoleMoreInfoModal();
  }

  showRoleMoreInfo(role: OneCompanyRoleType) {
    this.currentRole = role;

    const scopes = role.roleScopes;

    this.showRoleMoreInfoModal = true;
    this.currentRoleName = role.name;
    this.currentRoleDescription = role.description;

    this.currentRoleUsersManagementScope = !!scopes.find(
      (s) => s === Scopes.USER_MANAGEMENT
    );
    this.currentRoleRolesManagementScope = !!scopes.find(
      (s) => s === Scopes.ROLES_MANAGEMENT
    );
    this.currentRoleCompanyInfoManagementScope = !!scopes.find(
      (s) => s === Scopes.COMPANY_INFORMATION_MANAGEMENT
    );
  }

  changeCurrentRoleScope(roleScope: RoleScope) {
    switch (roleScope) {
      case 'USER_MANAGEMENT':
        this.currentRoleUsersManagementScope =
          !this.currentRoleUsersManagementScope;
        break;
      case 'ROLES_MANAGEMENT':
        this.currentRoleRolesManagementScope =
          !this.currentRoleRolesManagementScope;
        break;
      case 'COMPANY_INFORMATION_MANAGEMENT':
        this.currentRoleCompanyInfoManagementScope =
          !this.currentRoleCompanyInfoManagementScope;
        break;
    }
  }

  closeRoleMoreInfoModal() {
    this.showRoleMoreInfoModal = false;
  }

  pushNewRoleScope(scope: RoleScope) {
    if (!this.newRoleScopes.includes(scope)) this.newRoleScopes.push(scope);
    else this.newRoleScopes = this.newRoleScopes.filter((s) => s !== scope);
  }

  pushNewRoleAssignee(user: { id: string; email: string }) {
    this.newRoleMembers.push(user);
    this.newRoleMemberQuery = '';
    this.newRoleFoundMembers = [];
  }

  removeNewRoleAssignee(userId: string) {
    this.newRoleMembers = this.newRoleMembers.filter(({ id }) => id !== userId);
  }

  searchForCompanyMember(companyMember: string) {
    this.newRoleMemberQuery = companyMember;

    if (companyMember.length > 2) {
      this.companyUsersService
        .searchCompanyMembers({
          query: companyMember,
          page: '0',
          pageSize: '3'
        })
        .subscribe({
          next: async ({ companyMembers }) => {
            this.newRoleFoundMembers = companyMembers;
          }
        });
    }
  }

  showFoundCompanyMember() {
    return (
      this.newRoleMemberQuery.length > 0 && this.newRoleFoundMembers.length > 0
    );
  }

  disableCreateNewRoleButton() {
    return (
      !this.newRoleName ||
      !this.newRoleDescription ||
      this.incorrectNewRoleName ||
      this.incorrectNewRoleDescription ||
      this.newRoleScopes.length === 0 ||
      this.newRoleMembers.length === 0
    );
  }

  disableSaveRoleChangesButton() {
    const wasRoleNameChanged = this.currentRole.name === this.currentRoleName;
    const wasDescriptionChanged =
      this.currentRole.description === this.currentRoleDescription;

    const arrayScopes = this.transformScopesToArray();
    const wasRolesScopeChanged = this.utilsService.compareArrays(
      arrayScopes,
      this.currentRole.roleScopes
    );

    return wasRoleNameChanged && wasDescriptionChanged && wasRolesScopeChanged;
  }

  openCreateNewRoleModal() {
    this.showCreateNewRoleModal = true;
  }

  closeCreateNewRoleModal() {
    this.showCreateNewRoleModal = false;
    this.newRoleName = '';
    this.newRoleDescription = '';
    this.newRoleMemberQuery = '';
    this.newRoleScopes = [];
    this.newRoleFoundMembers = [];
  }

  fetchCompanyRoles() {
    this.getCompanyRoles.emit();
  }

  private transformScopesToArray() {
    const roleScopes: Array<RoleScope> = [];

    if (this.currentRoleUsersManagementScope)
      roleScopes.push(Scopes.USER_MANAGEMENT);

    if (this.currentRoleRolesManagementScope)
      roleScopes.push(Scopes.ROLES_MANAGEMENT);

    if (this.currentRoleCompanyInfoManagementScope)
      roleScopes.push(Scopes.COMPANY_INFORMATION_MANAGEMENT);

    return roleScopes;
  }

  ngOnInit() {
    this.fetchCompanyRoles();
  }

  protected readonly Scopes = Scopes;
}
