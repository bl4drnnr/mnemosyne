import { Component, Input } from '@angular/core';
import { GetMarketplaceCompanyStatsResponse } from '@responses/get-marketplace-company-stats.interface';

@Component({
  selector: 'dashboard-marketplace-company-stats',
  templateUrl: './marketplace-company-stats.component.html',
  styleUrls: ['./marketplace-company-stats.component.scss']
})
export class MarketplaceCompanyStatsComponent {
  @Input() companyStats: GetMarketplaceCompanyStatsResponse;
}
