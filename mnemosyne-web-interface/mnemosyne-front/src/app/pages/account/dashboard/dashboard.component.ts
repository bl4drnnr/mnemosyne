import { Component, OnInit } from '@angular/core';
import { UserInfoInterface } from '@responses/user-info.interface';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { TranslationService } from '@services/translation.service';
import { TitlesEnum } from '@interfaces/titles.enum';

@Component({
  selector: 'component-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userInfo: UserInfoInterface;

  constructor(
    private readonly refreshTokensService: RefreshTokensService,
    private readonly pageTitleService: TranslationService
  ) {}

  async ngOnInit() {
    this.pageTitleService.setPageTitle(TitlesEnum.DASHBOARD);

    const userInfoRequest = await this.refreshTokensService.refreshTokens();
    if (userInfoRequest)
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo)
      });
  }
}
