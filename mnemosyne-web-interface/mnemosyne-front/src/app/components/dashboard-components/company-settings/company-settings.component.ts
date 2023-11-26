import { Component, Input, OnInit } from '@angular/core';
import { CompanyService } from '@services/company.service';
import { GetCompanyInfoByIdInterface } from '@responses/get-company-by-id.interface';
import { CompanySettingsSectionType } from '@interfaces/company-settings-section.type';
import { UpdateCompanyInfoInterface } from '@payloads/update-company-info.interface';
import { TranslationService } from '@services/translation.service';
import { MessagesTranslation } from '@translations/messages.enum';
import { GlobalMessageService } from '@shared/global-message.service';
import { RefreshTokensService } from '@services/refresh-tokens.service';

@Component({
  selector: 'dashboard-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent implements OnInit {
  @Input() companyId: string;

  companySettingsSection: CompanySettingsSectionType = 'info';
  companyInformation: GetCompanyInfoByIdInterface;

  page: string = '0';
  pageSize: string = '10';
  totalItems: number;

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly translationService: TranslationService,
    private readonly companyService: CompanyService
  ) {}

  fetchCompanyInformation() {
    this.companyService
      .getCompanyInformationById({
        companyId: this.companyId,
        page: this.page,
        pageSize: this.pageSize
      })
      .subscribe({
        next: (companyInformation) => {
          this.totalItems = companyInformation.count;
          this.companyInformation = companyInformation;
        }
      });
  }

  saveCompanyInformation(payload: UpdateCompanyInfoInterface) {
    this.companyService.saveCompanyInformation(payload).subscribe({
      next: async ({ message }) => {
        const globalMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: globalMessage
        });
      },
      error: () => this.refreshTokensService.handleLogout()
    });
  }

  ngOnInit() {
    this.fetchCompanyInformation();
  }
}
