import { Component, Input, OnInit } from '@angular/core';
import { CompanyService } from '@services/company.service';
import { GetCompanyInfoByIdInterface } from '@responses/get-company-by-id.interface';

@Component({
  selector: 'dashboard-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent implements OnInit {
  @Input() companyId: string;

  companyInformation: GetCompanyInfoByIdInterface;

  page: string = '0';
  limit: string = '5';
  totalItems: number;

  constructor(private readonly companyService: CompanyService) {}

  ngOnInit() {
    this.companyService
      .getCompanyInformationById({
        companyId: this.companyId,
        page: this.page,
        limit: this.limit
      })
      .subscribe({
        next: (companyInformation) => {
          this.totalItems = companyInformation.count;
          this.companyInformation = companyInformation;
        }
      });
  }
}
