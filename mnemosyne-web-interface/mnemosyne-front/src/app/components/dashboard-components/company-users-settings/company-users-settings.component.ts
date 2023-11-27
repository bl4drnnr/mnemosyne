import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersList } from '@interfaces/users-list.type';

@Component({
  selector: 'dashboard-company-users-settings',
  templateUrl: './company-users-settings.component.html',
  styleUrls: ['./company-users-settings.component.scss']
})
export class CompanyUsersSettingsComponent implements OnInit {
  @Input() page: string;
  @Input() pageSize: string;
  @Input() totalItems: number;
  @Input() companyUsers: UsersList;
  @Output() fetchCompanyUsers = new EventEmitter<void>();
  @Output() setNewCurrentPage = new EventEmitter<string>();
  @Output() setNewUsersPerPage = new EventEmitter<string>();

  setCurrentPage(currentPage: string) {
    this.setNewCurrentPage.emit(currentPage);
  }

  setUsersPerPage(usersPerPage: string) {
    this.setNewUsersPerPage.emit(usersPerPage);
  }

  fetchUsers() {
    this.fetchCompanyUsers.emit();
  }

  ngOnInit() {
    this.fetchUsers();
  }
}
