import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.response';
import { RefreshTokensService } from '@services/refresh-tokens.service';

@Component({
  selector: 'layout-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userInfo: UserInfoResponse;

  constructor(private readonly refreshTokensService: RefreshTokensService) {}

  async ngOnInit() {
    this.userInfo = (await this.refreshTokensService.refreshTokens())!;
  }
}
