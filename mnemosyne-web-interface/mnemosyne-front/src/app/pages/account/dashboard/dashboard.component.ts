import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.response';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { PageTitleService } from '@services/page-title.service';
import { TitlesPages } from '@interfaces/titles.pages';

@Component({
  selector: 'component-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userInfo: UserInfoResponse;

  constructor(
    private readonly refreshTokensService: RefreshTokensService,
    private readonly pageTitleService: PageTitleService
  ) {}

  async ngOnInit() {
    this.pageTitleService.setPageTitle(TitlesPages.DASHBOARD);

    const userInfoRequest = await this.refreshTokensService.refreshTokens();
    if (userInfoRequest)
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo)
      });
  }
}
