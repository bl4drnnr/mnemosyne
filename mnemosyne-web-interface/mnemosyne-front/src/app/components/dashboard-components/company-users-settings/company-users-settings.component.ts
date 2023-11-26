import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsersList } from '@interfaces/users-list.type';

@Component({
  selector: 'dashboard-company-users-settings',
  templateUrl: './company-users-settings.component.html',
  styleUrls: ['./company-users-settings.component.scss']
})
export class CompanyUsersSettingsComponent {
  @Input() companyUsers: UsersList;
  // TODO Break fetching of company information and company users into 2 endpoints
  @Output() fetchCompanyUsers = new EventEmitter<void>();
}
