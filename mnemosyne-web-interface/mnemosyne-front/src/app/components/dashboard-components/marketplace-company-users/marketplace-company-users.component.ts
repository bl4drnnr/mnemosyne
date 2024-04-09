import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyMember } from '@responses/get-company-public-info.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard-marketplace-company-users',
  templateUrl: './marketplace-company-users.component.html',
  styleUrls: ['./marketplace-company-users.component.scss']
})
export class MarketplaceCompanyUsersComponent {
  @Input() page: string;
  @Input() pageSize: string;
  @Input() totalItems: number;
  @Input() query: string;
  @Input() companyMembers: Array<CompanyMember>;

  @Output() getCompanyEvent = new EventEmitter<void>();
  @Output() setNewCurrentPage = new EventEmitter<string>();
  @Output() setNewUsersPerPage = new EventEmitter<string>();
  @Output() setNewQuery = new EventEmitter<string>();

  constructor(private readonly router: Router) {}

  setCurrentPage(currentPage: string) {
    this.setNewCurrentPage.emit(currentPage);
  }

  setUsersPerPage(usersPerPage: string) {
    this.setNewUsersPerPage.emit(usersPerPage);
  }

  changeCompanyQuery(query: string) {
    this.setNewQuery.emit(query);
  }

  emitGetCompany() {
    this.getCompanyEvent.emit();
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }
}
