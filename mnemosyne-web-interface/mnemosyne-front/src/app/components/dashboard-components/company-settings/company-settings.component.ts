import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@services/company.service';
import { GetCompanyInfoByIdInterface } from '@responses/get-company-by-id.interface';
import { CompanySettingsSectionType } from '@interfaces/company-settings-section.type';
import { UpdateCompanyInfoInterface } from '@payloads/update-company-info.interface';
import { TranslationService } from '@services/translation.service';
import { MessagesTranslation } from '@translations/messages.enum';
import { GlobalMessageService } from '@shared/global-message.service';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { UsersList } from '@interfaces/users-list.type';

@Component({
  selector: 'dashboard-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent implements OnInit {
  companySettingsSection: CompanySettingsSectionType = 'info';
  companyInformation: GetCompanyInfoByIdInterface;

  page: string = '0';
  pageSize: string = '10';
  totalItems: number;
  companyUsers: UsersList;

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly translationService: TranslationService,
    private readonly companyService: CompanyService
  ) {}

  fetchCompanyInformation() {
    this.companyService.getCompanyInformationById().subscribe({
      next: (companyInformation) => {
        this.companyInformation = companyInformation;
      }
    });
  }

  fetchCompanyUsers() {
    this.companyService
      .getCompanyUsers({
        page: this.page,
        pageSize: this.pageSize
      })
      .subscribe({
        next: ({ companyUsers, count }) => {
          this.totalItems = count;
          this.companyUsers = companyUsers;
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
