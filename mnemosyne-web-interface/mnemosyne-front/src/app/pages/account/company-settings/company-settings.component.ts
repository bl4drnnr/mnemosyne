import { Component } from '@angular/core';
import { CompanySettingsSectionType } from '@interfaces/company-settings-section.type';
import { GetCompanyInfoByIdResponse } from '@responses/get-company-by-id.interface';
import { UsersList } from '@interfaces/users-list.type';
import { CompanyRoleType } from '@interfaces/company-role.type';
import { RolesService } from '@services/roles.service';
import { CompanyUsersService } from '@services/company-users.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { TranslationService } from '@services/translation.service';
import { CompanyService } from '@services/company.service';
import { UpdateCompanyInfoPayload } from '@payloads/update-company-info.interface';
import { UpdateUserInfoPayload } from '@payloads/update-user-info.interface';
import { CreateCompanyRolePayload } from '@payloads/create-company-role.interface';
import { UpdateCompanyRolePayload } from '@payloads/update-company-role.interface';
import { MessagesTranslation } from '@translations/messages.enum';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'page-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent {
  companySettingsSection: CompanySettingsSectionType = 'info';
  companyInformation: GetCompanyInfoByIdResponse;
  userInfo: UserInfoResponse;

  page: string = '0';
  pageSize: string = '10';
  totalItems: number;
  companyUsers: UsersList;
  companyRoles: CompanyRoleType;

  constructor(
    private readonly rolesService: RolesService,
    private readonly companyUsersService: CompanyUsersService,
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

  fetchCompanyRoles() {
    this.rolesService.getCompanyRoles().subscribe({
      next: ({ companyRoles }) => (this.companyRoles = companyRoles)
    });
  }

  saveCompanyInformation(payload: UpdateCompanyInfoPayload) {
    this.companyService.saveCompanyInformation(payload).subscribe({
      next: async ({ message }) => {
        await this.handleGlobalMessage(message);
      },
      error: () => this.refreshTokensService.handleLogout()
    });
  }

  saveCompanyMemberInformation(payload: UpdateUserInfoPayload) {
    this.companyUsersService.updateCompanyMemberInformation(payload).subscribe({
      next: async ({ message }) => {
        await this.handleGlobalMessage(message);
      },
      error: () => this.refreshTokensService.handleLogout()
    });
  }

  createNewRole(payload: CreateCompanyRolePayload) {
    this.rolesService.createCompanyRole(payload).subscribe({
      next: async ({ message }) => {
        await this.handleGlobalMessage(message);
      }
    });
  }

  updateRole(payload: UpdateCompanyRolePayload) {
    this.rolesService.updateCompanyRole(payload).subscribe({
      next: async ({ message }) => {
        await this.handleGlobalMessage(message);
        this.fetchCompanyRoles();
      }
    });
  }

  async deleteCompanyRole(message: string) {
    await this.handleGlobalMessage(message);
  }

  async deleteCompanyMember(message: string) {
    await this.handleGlobalMessage(message);
  }

  async transferCompanyOwnership(message: string) {
    await this.handleGlobalMessage(message);
  }

  async deleteCompanyAccount(message: string) {
    await this.handleGlobalMessage(message);
  }

  async handleGlobalMessage(message: string) {
    const globalMessage = await this.translationService.translateText(
      message,
      MessagesTranslation.RESPONSES
    );
    this.globalMessageService.handle({
      message: globalMessage
    });
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.COMPANY_SETTINGS);

    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo)
      });
    }

    this.fetchCompanyInformation();
    this.fetchCompanyRoles();
  }
}
