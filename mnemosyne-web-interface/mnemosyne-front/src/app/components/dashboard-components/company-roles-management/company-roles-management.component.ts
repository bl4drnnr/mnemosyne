import { Component, OnInit } from '@angular/core';

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
  newRoleDescription: string;
  showCreateNewRoleModal: boolean;

  createNewRole() {
    //
  }

  disableCreateNewRoleButton() {
    return true;
  }

  openCreateNewRoleModal() {
    this.showCreateNewRoleModal = true;
  }

  closeCreateNewRoleModal() {
    this.showCreateNewRoleModal = false;
  }

  ngOnInit() {}
}
