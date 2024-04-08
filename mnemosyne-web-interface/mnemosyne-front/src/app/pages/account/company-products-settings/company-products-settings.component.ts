import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { RefreshTokensService } from '@services/refresh-tokens.service';

@Component({
  selector: 'page-company-products-settings',
  templateUrl: './company-products-settings.component.html',
  styleUrls: ['./company-products-settings.component.scss']
})
export class CompanyProductsSettingsComponent implements OnInit {
  userInfo: UserInfoResponse;

  constructor(
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.COMPANY_PRODUCTS_SETTINGS);

    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo)
      });
    }
  }
}
