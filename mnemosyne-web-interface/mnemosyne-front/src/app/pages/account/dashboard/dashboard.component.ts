import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'component-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userInfo: UserInfoResponse;

  constructor(
    private readonly refreshTokensService: RefreshTokensService,
    private readonly translationService: TranslationService
  ) {}

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.DASHBOARD);

    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest)
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo)
      });
  }
}
