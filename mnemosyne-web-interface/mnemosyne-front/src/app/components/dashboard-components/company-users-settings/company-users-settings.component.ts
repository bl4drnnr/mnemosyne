import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersList } from '@interfaces/users-list.type';

@Component({
  selector: 'dashboard-company-users-settings',
  templateUrl: './company-users-settings.component.html',
  styleUrls: ['./company-users-settings.component.scss']
})
export class CompanyUsersSettingsComponent implements OnInit {
  @Input() companyUsers: UsersList;
  @Output() fetchCompanyUsers = new EventEmitter<void>();

  ngOnInit() {
    this.fetchCompanyUsers.emit();
  }
}
