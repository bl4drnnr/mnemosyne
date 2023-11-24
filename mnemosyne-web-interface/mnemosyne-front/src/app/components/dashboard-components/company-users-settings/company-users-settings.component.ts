import { Component, Input } from '@angular/core';
import { UsersList } from '@interfaces/users-list.type';

@Component({
  selector: 'dashboard-company-users-settings',
  templateUrl: './company-users-settings.component.html',
  styleUrls: ['./company-users-settings.component.scss']
})
export class CompanyUsersSettingsComponent {
  @Input() companyUsers: UsersList;
}
