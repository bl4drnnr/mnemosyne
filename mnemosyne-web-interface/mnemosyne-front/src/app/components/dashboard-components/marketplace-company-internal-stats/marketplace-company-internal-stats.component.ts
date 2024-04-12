import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyInternalStats } from '@responses/get-company-internal-stats.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard-marketplace-company-internal-stats',
  templateUrl: './marketplace-company-internal-stats.component.html',
  styleUrls: ['./marketplace-company-internal-stats.component.scss']
})
export class MarketplaceCompanyInternalStatsComponent {
  @Input() internalStatsQuery: string;
  @Input() companyInternalStats: CompanyInternalStats;

  @Output() changeInternalStatsQueryEvent = new EventEmitter<string>();
  @Output() fetchCompanyInternalStats = new EventEmitter<void>();

  constructor(private readonly router: Router) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  changeInternalStatsQuery(query: string) {
    this.changeInternalStatsQueryEvent.emit(query);
    this.fetchCompanyInternalStats.emit();
  }
}
