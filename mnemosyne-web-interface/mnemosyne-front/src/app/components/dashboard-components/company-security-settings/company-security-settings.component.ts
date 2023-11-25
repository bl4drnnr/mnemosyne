import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-company-security-settings',
  templateUrl: './company-security-settings.component.html',
  styleUrls: ['./company-security-settings.component.scss']
})
export class CompanySecuritySettingsComponent {
  @Input() companyOwnerEmail: string;
}
