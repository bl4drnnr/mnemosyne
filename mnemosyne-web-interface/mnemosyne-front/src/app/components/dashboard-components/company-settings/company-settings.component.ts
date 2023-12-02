import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@services/company.service';
import { GetCompanyInfoByIdResponse } from '@responses/get-company-by-id.interface';
import { CompanySettingsSectionType } from '@interfaces/company-settings-section.type';
import { UpdateCompanyInfoPayload } from '@payloads/update-company-info.interface';
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
  companyInformation: GetCompanyInfoByIdResponse;

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

  saveCompanyInformation(payload: UpdateCompanyInfoPayload) {
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

  async transferCompanyOwnership(message: string) {
    const globalMessage = await this.translationService.translateText(
      message,
      MessagesTranslation.RESPONSES
    );
    this.globalMessageService.handle({
      message: globalMessage
    });
  }

  ngOnInit() {
    this.fetchCompanyInformation();
  }
}
