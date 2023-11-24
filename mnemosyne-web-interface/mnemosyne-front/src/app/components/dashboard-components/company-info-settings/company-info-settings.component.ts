import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-company-info-settings',
  templateUrl: './company-info-settings.component.html',
  styleUrls: ['./company-info-settings.component.scss']
})
export class CompanyInfoSettingsComponent {
  @Input() companyName: string;
  @Input() companyLocation: string;
  @Input() companyWebsite: string;
  @Input() companyOwnerEmail: string;
}
